import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { generateCaptcha, verifyCaptcha } from './server/captcha.ts';
import {
  readDb,
  writeDb,
  normalizePhone,
  isValidIndonesianPhone,
  isValidAlphanumericPassword,
  hashPassword,
  verifyPassword,
  type DbUser,
} from './server/db.ts';
import type { AuthUser, ChildProfile, MeasurementRecord, NutritionCase } from './src/types/index.ts';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

interface AuthenticatedRequest extends Request {
  authUser?: DbUser;
  authToken?: string;
}

function sanitizeUser(u: DbUser): AuthUser {
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    role: u.role,
    posyanduName: u.posyanduName,
    createdAt: u.createdAt,
  };
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    res.status(401).json({ error: 'Sesi login tidak ditemukan. Silakan masuk terlebih dahulu.' });
    return;
  }

  const db = readDb();
  const session = db.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
  if (!session) {
    res.status(401).json({ error: 'Sesi telah berakhir. Silakan login ulang.' });
    return;
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    res.status(401).json({ error: 'Akun pengguna tidak ditemukan.' });
    return;
  }

  req.authUser = user;
  req.authToken = token;
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.authUser || req.authUser.role !== 'KADER') {
    res.status(403).json({ error: 'Akses ditolak. Fitur ini khusus Admin / Kader Posyandu.' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // =========================================================
  // AUTHENTICATION ROUTES
  // =========================================================

  // 1. Generate SVG Captcha Challenge
  app.get('/api/auth/captcha', (_req: Request, res: Response) => {
    const challenge = generateCaptcha();
    res.json(challenge);
  });

  // 2. Login Orang Tua (Nomor HP + Konfirmasi Captcha)
  app.post('/api/auth/login-parent', (req: Request, res: Response) => {
    const { phone, captchaId, captchaInput } = req.body || {};

    const captchaCheck = verifyCaptcha(String(captchaId || ''), String(captchaInput || ''));
    if (!captchaCheck.valid) {
      res.status(400).json({ error: captchaCheck.reason || 'Verifikasi Captcha gagal.' });
      return;
    }

    if (!phone || !isValidIndonesianPhone(String(phone))) {
      res.status(400).json({ error: 'Format nomor HP tidak valid. Gunakan awalan 08... (9-14 digit).' });
      return;
    }

    const normalized = normalizePhone(String(phone));
    const db = readDb();

    let user = db.users.find((u) => u.phone === normalized);

    // Jika belum ada di users tapi terdaftar sebagai parentPhone di data anak, buatkan akun otomatis
    if (!user) {
      const matchedChild = db.children.find((c) => normalizePhone(c.parentPhone) === normalized);
      if (matchedChild) {
        user = {
          id: `usr-parent-${Date.now()}`,
          name: matchedChild.parentName,
          phone: normalized,
          role: 'PARENT',
          posyanduName: matchedChild.posyanduName,
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
      }
    }

    if (!user) {
      res.status(404).json({
        error: 'Nomor HP belum terdaftar. Silakan daftar akun Orang Tua baru atau hubungi Kader Posyandu.',
      });
      return;
    }

    if (user.role === 'KADER') {
      res.status(403).json({
        error: 'Nomor HP ini terdaftar sebagai Admin Posyandu. Silakan masuk melalui tab Login Admin menggunakan kata sandi.',
      });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    db.sessions.push({
      token,
      userId: user.id,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    writeDb(db);

    res.json({ token, user: sanitizeUser(user) });
  });

  // 3. Registrasi Orang Tua Baru (Nama + Nomor HP + Konfirmasi Captcha)
  app.post('/api/auth/register-parent', (req: Request, res: Response) => {
    const { name, phone, captchaId, captchaInput } = req.body || {};

    const captchaCheck = verifyCaptcha(String(captchaId || ''), String(captchaInput || ''));
    if (!captchaCheck.valid) {
      res.status(400).json({ error: captchaCheck.reason || 'Verifikasi Captcha gagal.' });
      return;
    }

    const cleanName = String(name || '').trim();
    if (cleanName.length < 3) {
      res.status(400).json({ error: 'Nama lengkap orang tua minimal 3 karakter.' });
      return;
    }

    if (!phone || !isValidIndonesianPhone(String(phone))) {
      res.status(400).json({ error: 'Format nomor HP tidak valid. Gunakan awalan 08... (9-14 digit).' });
      return;
    }

    const normalized = normalizePhone(String(phone));
    const db = readDb();

    const existing = db.users.find((u) => u.phone === normalized);
    if (existing) {
      res.status(409).json({ error: 'Nomor HP sudah terdaftar. Silakan langsung masuk melalui tab Login Orang Tua.' });
      return;
    }

    const newUser: DbUser = {
      id: `usr-parent-${Date.now()}`,
      name: cleanName,
      phone: normalized,
      role: 'PARENT',
      posyanduName: 'Posyandu Melati A1',
      createdAt: new Date().toISOString(),
    };

    const token = crypto.randomBytes(32).toString('hex');
    db.users.push(newUser);
    db.sessions.push({
      token,
      userId: newUser.id,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    writeDb(db);

    res.status(201).json({ token, user: sanitizeUser(newUser) });
  });

  // 4. Login Admin / Kader Posyandu (Nomor HP + Sandi Huruf & Angka Biasa + Captcha)
  app.post('/api/auth/login-admin', (req: Request, res: Response) => {
    const { phone, password, captchaId, captchaInput } = req.body || {};

    const captchaCheck = verifyCaptcha(String(captchaId || ''), String(captchaInput || ''));
    if (!captchaCheck.valid) {
      res.status(400).json({ error: captchaCheck.reason || 'Verifikasi Captcha gagal.' });
      return;
    }

    if (!phone || !isValidIndonesianPhone(String(phone))) {
      res.status(400).json({ error: 'Format nomor HP Admin tidak valid. Gunakan awalan 08...' });
      return;
    }

    const rawPassword = String(password || '');
    if (!isValidAlphanumericPassword(rawPassword)) {
      res.status(400).json({
        error: 'Kata sandi harus terdiri dari huruf dan angka biasa (minimal 6 karakter, tanpa spasi/simbol).',
      });
      return;
    }

    const normalized = normalizePhone(String(phone));
    const db = readDb();

    const adminUser = db.users.find((u) => u.phone === normalized && u.role === 'KADER');
    if (!adminUser || !adminUser.passwordHash || !verifyPassword(rawPassword, adminUser.passwordHash)) {
      res.status(401).json({ error: 'Nomor HP atau kata sandi Admin salah.' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    db.sessions.push({
      token,
      userId: adminUser.id,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    writeDb(db);

    res.json({ token, user: sanitizeUser(adminUser) });
  });

  // 5. Cek Sesi Aktif
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: sanitizeUser(req.authUser!) });
  });

  // 6. Logout
  app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = readDb();
    db.sessions = db.sessions.filter((s) => s.token !== req.authToken);
    writeDb(db);
    res.json({ ok: true });
  });

  // 7. Ganti Sandi Admin (huruf & angka biasa)
  app.post('/api/auth/change-password', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body || {};

    if (!req.authUser?.passwordHash || !verifyPassword(String(currentPassword || ''), req.authUser.passwordHash)) {
      res.status(400).json({ error: 'Kata sandi saat ini tidak sesuai.' });
      return;
    }

    const cleanNew = String(newPassword || '');
    if (!isValidAlphanumericPassword(cleanNew)) {
      res.status(400).json({
        error: 'Sandi baru harus memakai huruf dan angka biasa (6-32 karakter, tanpa simbol/spasi).',
      });
      return;
    }

    const db = readDb();
    const target = db.users.find((u) => u.id === req.authUser!.id);
    if (target) {
      target.passwordHash = hashPassword(cleanNew);
      writeDb(db);
    }

    res.json({ ok: true, message: 'Kata sandi Admin berhasil diperbarui.' });
  });

  // =========================================================
  // ADMIN USER MANAGEMENT ROUTES
  // =========================================================

  app.get('/api/admin/users', requireAuth, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    const db = readDb();
    res.json({ users: db.users.map(sanitizeUser) });
  });

  app.post('/api/admin/users', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { name, phone, role, password } = req.body || {};

    const cleanName = String(name || '').trim();
    if (cleanName.length < 3) {
      res.status(400).json({ error: 'Nama pengguna minimal 3 karakter.' });
      return;
    }

    if (!phone || !isValidIndonesianPhone(String(phone))) {
      res.status(400).json({ error: 'Format nomor HP tidak valid (awalan 08...).' });
      return;
    }

    const userRole: 'PARENT' | 'KADER' = role === 'KADER' ? 'KADER' : 'PARENT';
    const normalized = normalizePhone(String(phone));

    if (userRole === 'KADER' && !isValidAlphanumericPassword(String(password || ''))) {
      res.status(400).json({
        error: 'Sandi Admin wajib huruf dan angka biasa (minimal 6 karakter, tanpa simbol/spasi).',
      });
      return;
    }

    const db = readDb();
    if (db.users.some((u) => u.phone === normalized)) {
      res.status(409).json({ error: 'Nomor HP sudah terdaftar di sistem.' });
      return;
    }

    const created: DbUser = {
      id: `usr-${userRole.toLowerCase()}-${Date.now()}`,
      name: cleanName,
      phone: normalized,
      role: userRole,
      posyanduName: 'Posyandu Melati A1',
      ...(userRole === 'KADER' ? { passwordHash: hashPassword(String(password)) } : {}),
      createdAt: new Date().toISOString(),
    };

    db.users.push(created);
    writeDb(db);
    res.status(201).json({ user: sanitizeUser(created) });
  });

  // =========================================================
  // APPLICATION DATA ROUTES (PERSISTENT)
  // =========================================================

  app.get('/api/app-data', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = readDb();
    const user = req.authUser!;

    if (user.role === 'PARENT') {
      const myChildren = db.children.filter((c) => normalizePhone(c.parentPhone) === user.phone);
      const myChildIds = new Set(myChildren.map((c) => c.id));
      res.json({
        children: myChildren,
        measurements: db.measurements.filter((m) => myChildIds.has(m.childId)),
        immunizations: db.immunizations.filter((i) => myChildIds.has(i.childId)),
        milestones: db.milestones.filter((m) => myChildIds.has(m.childId)),
        schedules: db.schedules,
        cases: [],
      });
      return;
    }

    res.json({
      children: db.children,
      measurements: db.measurements,
      immunizations: db.immunizations,
      milestones: db.milestones,
      schedules: db.schedules,
      cases: db.cases,
    });
  });

  app.post('/api/children', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const child = req.body as ChildProfile;
    if (!child || !child.name) {
      res.status(400).json({ error: 'Data balita tidak lengkap.' });
      return;
    }

    const db = readDb();
    const normalizedParentPhone = normalizePhone(child.parentPhone || '');
    const savedChild: ChildProfile = {
      ...child,
      parentPhone: normalizedParentPhone || child.parentPhone,
    };

    db.children.unshift(savedChild);

    // Otomatis daftarkan akun orang tua jika nomor HP valid dan belum punya akun
    if (normalizedParentPhone && isValidIndonesianPhone(normalizedParentPhone)) {
      const hasUser = db.users.some((u) => u.phone === normalizedParentPhone);
      if (!hasUser) {
        db.users.push({
          id: `usr-parent-${Date.now()}`,
          name: savedChild.parentName,
          phone: normalizedParentPhone,
          role: 'PARENT',
          posyanduName: savedChild.posyanduName,
          createdAt: new Date().toISOString(),
        });
      }
    }

    writeDb(db);
    res.status(201).json({ child: savedChild });
  });

  app.post('/api/measurements', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const record = req.body as MeasurementRecord;
    if (!record || !record.childId) {
      res.status(400).json({ error: 'Data pengukuran tidak lengkap.' });
      return;
    }

    const db = readDb();
    db.measurements.unshift(record);

    let createdCase: NutritionCase | null = null;
    if (record.kmsGrowthStatus === 'T' || record.pbuZScore < -2) {
      const child = db.children.find((c) => c.id === record.childId);
      if (child) {
        createdCase = {
          id: `cs-${Date.now()}`,
          childId: child.id,
          childName: child.name,
          childAge: record.ageMonths,
          childGender: child.gender,
          parentName: child.parentName,
          parentPhone: child.parentPhone,
          issueType: record.pbuZScore < -2 ? 'STUNTING' : '2T_BERTURUT',
          detectedDate: record.date,
          status: 'TERBUKA',
          actionNote:
            record.pbuZScore < -2
              ? 'Z-score PB/U < -2 SD (Kategori Pendek). Dianjurkan konseling gizi dan pemberian PMT pemulihan.'
              : 'Kenaikan berat badan di bawah KBM. Perlu evaluasi pola makan dan pemantauan 1 bulan lagi.',
          posyanduName: child.posyanduName,
        };
        db.cases.unshift(createdCase);
      }
    }

    writeDb(db);
    res.status(201).json({ measurement: record, createdCase });
  });

  app.patch('/api/cases/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body || {};
    const db = readDb();
    const target = db.cases.find((c) => c.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Kasus tidak ditemukan.' });
      return;
    }
    target.status = status;
    writeDb(db);
    res.json({ nutritionCase: target });
  });

  app.patch('/api/milestones/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = readDb();
    const target = db.milestones.find((m) => m.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Milestone tidak ditemukan.' });
      return;
    }
    target.isAchieved = !target.isAchieved;
    target.dateAchieved = target.isAchieved ? new Date().toISOString().split('T')[0] : undefined;
    writeDb(db);
    res.json({ milestone: target });
  });

  app.patch('/api/immunizations/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = readDb();
    const target = db.immunizations.find((i) => i.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Data imunisasi tidak ditemukan.' });
      return;
    }
    target.status = 'COMPLETED';
    target.dateGiven = target.dateGiven || new Date().toISOString().split('T')[0];
    target.location = target.location || 'Posyandu Melati A1';
    target.batchNumber = target.batchNumber || 'VAK-2026-X';
    writeDb(db);
    res.json({ immunization: target });
  });

  app.patch('/api/schedules/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = readDb();
    const target = db.schedules.find((s) => s.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Jadwal tidak ditemukan.' });
      return;
    }
    target.attendanceStatus = target.attendanceStatus === 'TERKONFIRMASI' ? 'IZIN' : 'TERKONFIRMASI';
    writeDb(db);
    res.json({ schedule: target });
  });

  // =========================================================
  // VITE MIDDLEWARE (DEV) OR STATIC ASSETS (PROD)
  // =========================================================

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PantauGizi Balita server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
