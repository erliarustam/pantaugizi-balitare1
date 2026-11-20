import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  AppRole,
  ChildProfile,
  MeasurementRecord,
  ImmunizationItem,
  MilestoneItem,
  PosyanduSchedule,
  NutritionCase,
} from '../src/types/index.ts';
import {
  INITIAL_CHILDREN,
  INITIAL_MEASUREMENTS,
  INITIAL_IMMUNIZATIONS,
  INITIAL_MILESTONES,
  INITIAL_SCHEDULES,
  INITIAL_CASES,
} from '../src/data/initialData.ts';

export interface DbUser {
  id: string;
  name: string;
  phone: string; // format standar 08...
  role: AppRole;
  posyanduName: string;
  passwordHash?: string; // format "salt:hash" untuk Admin/Kader
  createdAt: string;
}

export interface DbSession {
  token: string;
  userId: string;
  expiresAt: number;
}

export interface DatabaseSchema {
  users: DbUser[];
  sessions: DbSession[];
  children: ChildProfile[];
  measurements: MeasurementRecord[];
  immunizations: ImmunizationItem[];
  milestones: MilestoneItem[];
  schedules: PosyanduSchedule[];
  cases: NutritionCase[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'pantaugizi-db.json');

/**
 * Normalisasi nomor HP Indonesia ke format 08...
 * Menerima input seperti: +62812..., 62812..., 0812..., 0812-3456-7890
 */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62')) {
    digits = '0' + digits.slice(2);
  }
  return digits;
}

export function isValidIndonesianPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^08\d{7,12}$/.test(normalized);
}

/**
 * Validasi sandi: huruf dan angka biasa (alfanumerik), minimal 6 karakter
 */
export function isValidAlphanumericPassword(password: string): boolean {
  return /^[a-zA-Z0-9]{6,32}$/.test(password);
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, key] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

function createInitialDb(): DatabaseSchema {
  const now = new Date().toISOString();

  const initialUsers: DbUser[] = [
    // Admin / Kader Posyandu default (No HP + Sandi huruf dan angka biasa)
    {
      id: 'usr-admin-01',
      name: 'Ibu Siti (Admin Kader Utama)',
      phone: '081122334455',
      role: 'KADER',
      posyanduName: 'Posyandu Melati A1',
      passwordHash: hashPassword('Kader2026'),
      createdAt: now,
    },
    {
      id: 'usr-admin-02',
      name: 'Ibu Maryam (Admin Kader)',
      phone: '081199887766',
      role: 'KADER',
      posyanduName: 'Posyandu Melati A1',
      passwordHash: hashPassword('Melati123'),
      createdAt: now,
    },
    // Akun Orang Tua terdaftar sesuai data anak
    {
      id: 'usr-parent-01',
      name: 'Ibu Ratna Dewi / Bpk Rudi',
      phone: '081234567890',
      role: 'PARENT',
      posyanduName: 'Posyandu Melati A1',
      createdAt: now,
    },
    {
      id: 'usr-parent-02',
      name: 'Ibu Siti Aminah',
      phone: '081398765432',
      role: 'PARENT',
      posyanduName: 'Posyandu Melati A1',
      createdAt: now,
    },
    {
      id: 'usr-parent-03',
      name: 'Ibu Nurhayati',
      phone: '085711223344',
      role: 'PARENT',
      posyanduName: 'Posyandu Melati A1',
      createdAt: now,
    },
  ];

  return {
    users: initialUsers,
    sessions: [],
    children: INITIAL_CHILDREN,
    measurements: INITIAL_MEASUREMENTS,
    immunizations: INITIAL_IMMUNIZATIONS,
    milestones: INITIAL_MILESTONES,
    schedules: INITIAL_SCHEDULES,
    cases: INITIAL_CASES,
  };
}

export function readDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = createInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    // Cleanup expired sessions
    const now = Date.now();
    parsed.sessions = (parsed.sessions || []).filter((s) => s.expiresAt > now);
    return parsed;
  } catch {
    const initial = createInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
