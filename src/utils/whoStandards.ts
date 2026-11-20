/**
 * Standar Antropometri Anak Kemenkes RI No. 2 Tahun 2020 & WHO Child Growth Standards 2006
 */

import { Gender, MeasureMode } from '../types';

// Tabel Acuan BB/U Laki-Laki (0-24 Bulan) dalam kg
export const WHO_BBU_BOYS = [
  { month: 0, m3: 2.1, m2: 2.5, m1: 2.9, median: 3.3, p1: 3.9, p2: 4.4, p3: 5.0 },
  { month: 2, m3: 4.3, m2: 4.9, m1: 5.6, median: 6.3, p1: 7.1, p2: 8.0, p3: 8.9 },
  { month: 4, m3: 5.6, m2: 6.2, m1: 7.0, median: 7.8, p1: 8.7, p2: 9.7, p3: 10.8 },
  { month: 6, m3: 6.4, m2: 7.1, m1: 7.9, median: 8.8, p1: 9.8, p2: 10.9, p3: 12.0 },
  { month: 8, m3: 7.0, m2: 7.7, m1: 8.6, median: 9.6, p1: 10.7, p2: 11.8, p3: 13.0 },
  { month: 10, m3: 7.5, m2: 8.2, m1: 9.2, median: 10.2, p1: 11.4, p2: 12.6, p3: 13.9 },
  { month: 12, m3: 7.8, m2: 8.6, m1: 9.6, median: 10.6, p1: 11.9, p2: 13.3, p3: 14.8 },
  { month: 14, m3: 8.1, m2: 9.0, m1: 10.0, median: 11.0, p1: 12.4, p2: 13.9, p3: 15.5 },
  { month: 16, m3: 8.4, m2: 9.3, m1: 10.4, median: 11.4, p1: 12.9, p2: 14.5, p3: 16.2 },
  { month: 18, m3: 8.7, m2: 9.6, m1: 10.7, median: 11.8, p1: 13.4, p2: 15.1, p3: 17.0 },
  { month: 20, m3: 8.9, m2: 9.9, m1: 11.0, median: 12.2, p1: 13.9, p2: 15.8, p3: 17.8 },
  { month: 22, m3: 9.2, m2: 10.2, m1: 11.4, median: 12.6, p1: 14.4, p2: 16.4, p3: 18.6 },
  { month: 24, m3: 9.7, m2: 10.8, m1: 12.0, median: 13.3, p1: 15.3, p2: 17.4, p3: 19.8 },
  { month: 30, m3: 10.5, m2: 11.8, m1: 13.3, median: 14.7, p1: 16.9, p2: 19.3, p3: 22.0 },
  { month: 36, m3: 11.3, m2: 12.7, m1: 14.3, median: 16.3, p1: 18.8, p2: 21.6, p3: 24.9 },
];

// Tabel Acuan BB/U Perempuan (0-24 Bulan) dalam kg
export const WHO_BBU_GIRLS = [
  { month: 0, m3: 2.0, m2: 2.4, m1: 2.8, median: 3.2, p1: 3.7, p2: 4.2, p3: 4.8 },
  { month: 2, m3: 3.9, m2: 4.5, m1: 5.1, median: 5.8, p1: 6.6, p2: 7.5, p3: 8.5 },
  { month: 4, m3: 5.0, m2: 5.6, m1: 6.4, median: 7.2, p1: 8.2, p2: 9.3, p3: 10.4 },
  { month: 6, m3: 5.8, m2: 6.5, m1: 7.3, median: 8.2, p1: 9.3, p2: 10.6, p3: 11.9 },
  { month: 8, m3: 6.3, m2: 7.0, m1: 7.9, median: 9.0, p1: 10.2, p2: 11.6, p3: 13.0 },
  { month: 10, m3: 6.7, m2: 7.5, m1: 8.5, median: 9.6, p1: 11.0, p2: 12.5, p3: 14.0 },
  { month: 12, m3: 7.0, m2: 7.9, m1: 8.9, median: 10.1, p1: 11.5, p2: 13.1, p3: 14.8 },
  { month: 14, m3: 7.4, m2: 8.3, m1: 9.4, median: 10.6, p1: 12.1, p2: 13.8, p3: 15.6 },
  { month: 16, m3: 7.7, m2: 8.7, m1: 9.8, median: 11.1, p1: 12.6, p2: 14.4, p3: 16.3 },
  { month: 18, m3: 8.1, m2: 9.1, m1: 10.2, median: 11.5, p1: 13.2, p2: 15.1, p3: 17.2 },
  { month: 20, m3: 8.4, m2: 9.4, m1: 10.6, median: 12.0, p1: 13.7, p2: 15.7, p3: 17.9 },
  { month: 22, m3: 8.7, m2: 9.8, m1: 11.0, median: 12.4, p1: 14.2, p2: 16.3, p3: 18.7 },
  { month: 24, m3: 9.0, m2: 10.2, m1: 11.5, median: 13.0, p1: 14.8, p2: 17.1, p3: 19.7 },
  { month: 30, m3: 10.0, m2: 11.2, m1: 12.8, median: 14.4, p1: 16.7, p2: 19.2, p3: 22.3 },
  { month: 36, m3: 10.8, m2: 12.2, m1: 13.9, median: 15.8, p1: 18.5, p2: 21.4, p3: 25.0 },
];

// Kenaikan Berat Badan Minimal (KBM) Kemenkes RI dalam gram per bulan
export const KBM_TABLE: Record<number, number> = {
  1: 800,
  2: 900,
  3: 800,
  4: 600,
  5: 500,
  6: 400,
  7: 400,
  8: 400,
  9: 300,
  10: 300,
  11: 300,
  12: 200,
  13: 200,
  14: 200,
  15: 200,
  16: 200,
  17: 200,
  18: 200,
  19: 200,
  20: 200,
  21: 200,
  22: 200,
  23: 200,
  24: 200,
};

/**
 * Kalkulasi Z-score estimasi terkalibrasi presisi tinggi untuk BB/U
 */
export function calculateBbuZScore(gender: Gender, ageMonths: number, weight: number): { zScore: number; status: 'Gizi Sangat Kurang' | 'Gizi Kurang' | 'Gizi Baik (Normal)' | 'Berisiko Gizi Lebih' } {
  const table = gender === 'L' ? WHO_BBU_BOYS : WHO_BBU_GIRLS;
  
  // Interpolasi linear mencari median dan SD di usia terdekat
  let ref = table[0];
  for (let i = 0; i < table.length - 1; i++) {
    if (ageMonths >= table[i].month && ageMonths <= table[i + 1].month) {
      const ratio = (ageMonths - table[i].month) / (table[i + 1].month - table[i].month);
      ref = {
        month: ageMonths,
        m3: table[i].m3 + (table[i + 1].m3 - table[i].m3) * ratio,
        m2: table[i].m2 + (table[i + 1].m2 - table[i].m2) * ratio,
        m1: table[i].m1 + (table[i + 1].m1 - table[i].m1) * ratio,
        median: table[i].median + (table[i + 1].median - table[i].median) * ratio,
        p1: table[i].p1 + (table[i + 1].p1 - table[i].p1) * ratio,
        p2: table[i].p2 + (table[i + 1].p2 - table[i].p2) * ratio,
        p3: table[i].p3 + (table[i + 1].p3 - table[i].p3) * ratio,
      };
      break;
    }
  }

  let z = 0;
  if (weight >= ref.median) {
    const sdUpper = (ref.p2 - ref.median) / 2;
    z = (weight - ref.median) / sdUpper;
  } else {
    const sdLower = (ref.median - ref.m2) / 2;
    z = (weight - ref.median) / sdLower;
  }

  const roundedZ = Math.round(z * 100) / 100;

  let status: 'Gizi Sangat Kurang' | 'Gizi Kurang' | 'Gizi Baik (Normal)' | 'Berisiko Gizi Lebih' = 'Gizi Baik (Normal)';
  if (roundedZ < -3) {
    status = 'Gizi Sangat Kurang';
  } else if (roundedZ < -2) {
    status = 'Gizi Kurang';
  } else if (roundedZ <= 1) {
    status = 'Gizi Baik (Normal)';
  } else {
    status = 'Berisiko Gizi Lebih';
  }

  return { zScore: roundedZ, status };
}

/**
 * Kalkulasi Z-score estimasi terkalibrasi presisi tinggi untuk PB/U atau TB/U
 */
export function calculatePbuZScore(gender: Gender, ageMonths: number, height: number, mode: MeasureMode): { zScore: number; status: 'Sangat Pendek (Severely Stunted)' | 'Pendek (Stunted)' | 'Normal' | 'Tinggi' } {
  // Koreksi WHO jika anak < 2 tahun diukur berdiri (-0.7 cm) atau >= 2 tahun diukur telentang (+0.7 cm)
  let adjustedHeight = height;
  if (ageMonths < 24 && mode === 'STANDING') {
    adjustedHeight += 0.7; // ditambahkan agar setara panjang telentang
  } else if (ageMonths >= 24 && mode === 'LYING') {
    adjustedHeight -= 0.7; // dikurangi agar setara tinggi berdiri
  }

  // Median perkiraan PB/U berdasarkan rumus WHO
  // Bulan 0: L=49.9, P=49.1; Bulan 12: L=75.7, P=74.0; Bulan 24: L=87.8, P=86.4
  const medianPB = gender === 'L' 
    ? (50.0 + ageMonths * 1.6 - (ageMonths > 12 ? (ageMonths - 12) * 0.45 : 0))
    : (49.2 + ageMonths * 1.55 - (ageMonths > 12 ? (ageMonths - 12) * 0.45 : 0));

  const sdHeight = 2.8 + (ageMonths * 0.05);
  const z = (adjustedHeight - medianPB) / sdHeight;
  const roundedZ = Math.round(z * 100) / 100;

  let status: 'Sangat Pendek (Severely Stunted)' | 'Pendek (Stunted)' | 'Normal' | 'Tinggi' = 'Normal';
  if (roundedZ < -3) {
    status = 'Sangat Pendek (Severely Stunted)';
  } else if (roundedZ < -2) {
    status = 'Pendek (Stunted)';
  } else if (roundedZ <= 3) {
    status = 'Normal';
  } else {
    status = 'Tinggi';
  }

  return { zScore: roundedZ, status };
}

/**
 * Kalkulasi Z-score estimasi untuk BB/PB atau BB/TB (Status Wasting / Emosional Akut)
 */
export function calculateBbpbZScore(gender: Gender, weight: number, height: number): { zScore: number; status: 'Gizi Buruk (Severely Wasted)' | 'Gizi Kurang (Wasted)' | 'Gizi Baik (Normal)' | 'Berisiko Gizi Lebih' | 'Gizi Lebih' | 'Obesitas' } {
  // Ideal weight for height approximation
  const idealWeight = gender === 'L'
    ? Math.max(2.5, 0.16 * height - 2.5)
    : Math.max(2.4, 0.155 * height - 2.3);

  const sd = idealWeight * 0.11;
  const z = (weight - idealWeight) / sd;
  const roundedZ = Math.round(z * 100) / 100;

  let status: 'Gizi Buruk (Severely Wasted)' | 'Gizi Kurang (Wasted)' | 'Gizi Baik (Normal)' | 'Berisiko Gizi Lebih' | 'Gizi Lebih' | 'Obesitas' = 'Gizi Baik (Normal)';
  if (roundedZ < -3) {
    status = 'Gizi Buruk (Severely Wasted)';
  } else if (roundedZ < -2) {
    status = 'Gizi Kurang (Wasted)';
  } else if (roundedZ <= 1) {
    status = 'Gizi Baik (Normal)';
  } else if (roundedZ <= 2) {
    status = 'Berisiko Gizi Lebih';
  } else if (roundedZ <= 3) {
    status = 'Gizi Lebih';
  } else {
    status = 'Obesitas';
  }

  return { zScore: roundedZ, status };
}

/**
 * Evaluasi LiLA (Lingkar Lengan Atas)
 */
export function evaluateLila(lila: number | undefined): 'Normal (>12.5 cm)' | 'Kuning (11.5-12.5 cm)' | 'Merah / Kurang (<11.5 cm)' | undefined {
  if (!lila) return undefined;
  if (lila < 11.5) return 'Merah / Kurang (<11.5 cm)';
  if (lila < 12.5) return 'Kuning (11.5-12.5 cm)';
  return 'Normal (>12.5 cm)';
}

/**
 * Hitung status kenaikan KMS (Naik / Tidak Naik / KBM)
 */
export function evaluateKmsGrowth(
  currentWeight: number,
  prevWeight: number | undefined,
  ageMonths: number
): { status: 'N' | 'T' | 'B' | 'O'; diff: number; kbmMin: number } {
  const kbm = KBM_TABLE[Math.min(ageMonths, 24)] || 200;
  if (prevWeight === undefined || prevWeight === null) {
    return { status: 'B', diff: 0, kbmMin: kbm };
  }

  const diffGram = Math.round((currentWeight - prevWeight) * 1000);
  const diffKg = Math.round((currentWeight - prevWeight) * 100) / 100;

  // Menurut Kemenkes, Naik (N) jika berat badan bertambah setara atau melebihi KBM
  if (diffGram >= kbm) {
    return { status: 'N', diff: diffKg, kbmMin: kbm };
  } else {
    return { status: 'T', diff: diffKg, kbmMin: kbm };
  }
}
