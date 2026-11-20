import crypto from 'node:crypto';

interface StoredCaptcha {
  answer: string;
  expiresAt: number;
}

const captchaStore = new Map<string, StoredCaptcha>();

// Karakter alfanumerik yang mudah dibaca (tanpa 0/O, 1/I/l)
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CAPTCHA_TTL_MS = 3 * 60 * 1000; // 3 menit

function cleanupExpiredCaptchas() {
  const now = Date.now();
  for (const [id, item] of captchaStore.entries()) {
    if (item.expiresAt < now) {
      captchaStore.delete(id);
    }
  }
}

export function generateCaptcha(): { captchaId: string; svg: string; expiresAt: number } {
  cleanupExpiredCaptchas();

  let code = '';
  for (let i = 0; i < 5; i++) {
    const idx = crypto.randomInt(0, CAPTCHA_CHARS.length);
    code += CAPTCHA_CHARS[idx];
  }

  const captchaId = crypto.randomUUID();
  const expiresAt = Date.now() + CAPTCHA_TTL_MS;

  captchaStore.set(captchaId, {
    answer: code.toUpperCase(),
    expiresAt,
  });

  const width = 220;
  const height = 64;

  // Warna acak yang tetap kontras di background terang
  const palette = ['#065f46', '#0f766e', '#1e3a8a', '#7c2d12', '#312e81', '#0f172a'];

  // Garis pengganggu (noise lines)
  const noiseLines: string[] = [];
  for (let i = 0; i < 6; i++) {
    const x1 = crypto.randomInt(0, width);
    const y1 = crypto.randomInt(0, height);
    const x2 = crypto.randomInt(0, width);
    const y2 = crypto.randomInt(0, height);
    const color = palette[crypto.randomInt(0, palette.length)];
    noiseLines.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.4" opacity="0.28" />`
    );
  }

  // Titik-titik pengganggu (dots)
  const noiseDots: string[] = [];
  for (let i = 0; i < 28; i++) {
    const cx = crypto.randomInt(5, width - 5);
    const cy = crypto.randomInt(5, height - 5);
    const r = (crypto.randomInt(10, 22) / 10).toFixed(1);
    const color = palette[crypto.randomInt(0, palette.length)];
    noiseDots.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.25" />`);
  }

  // Huruf Captcha dengan rotasi dan posisi acak ringan
  const charElements: string[] = [];
  for (let i = 0; i < code.length; i++) {
    const x = 26 + i * 38 + crypto.randomInt(-3, 4);
    const y = 42 + crypto.randomInt(-5, 6);
    const rotate = crypto.randomInt(-18, 19);
    const color = palette[crypto.randomInt(0, palette.length)];
    charElements.push(
      `<text x="${x}" y="${y}" fill="${color}" font-family="monospace, sans-serif" font-size="28" font-weight="800" transform="rotate(${rotate} ${x} ${y})">${code[i]}</text>`
    );
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ecfdf5" />
      <stop offset="50%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f0fdfa" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="12" fill="url(#bgGrad)" stroke="#cbd5e1" stroke-width="1.5" />
  ${noiseLines.join('\n  ')}
  ${noiseDots.join('\n  ')}
  ${charElements.join('\n  ')}
</svg>`.trim();

  return { captchaId, svg, expiresAt };
}

export function verifyCaptcha(captchaId: string, userInput: string): { valid: boolean; reason?: string } {
  cleanupExpiredCaptchas();

  if (!captchaId || !userInput) {
    return { valid: false, reason: 'Kode Captcha wajib diisi.' };
  }

  const stored = captchaStore.get(captchaId);
  if (!stored) {
    return { valid: false, reason: 'Captcha kedaluwarsa atau sudah digunakan. Silakan muat ulang Captcha.' };
  }

  // Sekali pakai (hapus segera setelah dicoba agar tidak bisa brute-force ID yang sama)
  captchaStore.delete(captchaId);

  if (Date.now() > stored.expiresAt) {
    return { valid: false, reason: 'Waktu Captcha telah habis. Silakan muat ulang Captcha.' };
  }

  const normalizedInput = userInput.trim().toUpperCase();
  if (normalizedInput !== stored.answer) {
    return { valid: false, reason: 'Kode Captcha tidak cocok. Silakan coba lagi.' };
  }

  return { valid: true };
}
