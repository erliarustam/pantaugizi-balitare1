export type AppRole = 'PARENT' | 'KADER';

export type Gender = 'L' | 'P'; // L: Laki-laki, P: Perempuan

export type MeasureMode = 'LYING' | 'STANDING'; // Terlentang (<24 bln) vs Berdiri (>=24 bln)

export type GrowthMetric = 'bbu' | 'pbu' | 'bbpb' | 'lila';

export interface ChildProfile {
  id: string;
  nik: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  birthWeight: number; // kg
  birthLength: number; // cm
  headCircumferenceBirth?: number; // cm
  parentName: string;
  parentPhone: string;
  parentNik: string;
  address: string;
  rt: string;
  rw: string;
  posyanduId: string;
  posyanduName: string;
  hasKiaBook: boolean;
  bpjsNumber?: string;
  avatarColor: string;
}

export interface MeasurementRecord {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  ageMonths: number;
  weight: number; // kg
  height: number; // cm
  measureMode: MeasureMode;
  headCircumference?: number; // cm
  upperArmCircumference?: number; // LiLA in cm
  hasEdema: boolean;
  notes?: string;
  cadreName: string;
  posyanduName: string;
  
  // Evaluasi WHO Z-Score & Status Antropometri
  bbuZScore: number;
  bbuStatus: 'Gizi Sangat Kurang' | 'Gizi Kurang' | 'Gizi Baik (Normal)' | 'Berisiko Gizi Lebih';
  
  pbuZScore: number;
  pbuStatus: 'Sangat Pendek (Severely Stunted)' | 'Pendek (Stunted)' | 'Normal' | 'Tinggi';
  
  bbpbZScore: number;
  bbpbStatus: 'Gizi Buruk (Severely Wasted)' | 'Gizi Kurang (Wasted)' | 'Gizi Baik (Normal)' | 'Berisiko Gizi Lebih' | 'Gizi Lebih' | 'Obesitas';
  
  lilaStatus?: 'Normal (>12.5 cm)' | 'Kuning (11.5-12.5 cm)' | 'Merah / Kurang (<11.5 cm)';
  
  // Status Kenaikan KMS: N = Naik, T = Tidak Naik, B = Baru, O = Tidak ditimbang bln lalu
  kmsGrowthStatus: 'N' | 'T' | 'B' | 'O';
  weightDiff?: number; // selisih dengan bulan sebelumnya (kg)
}

export interface ImmunizationItem {
  id: string;
  childId: string;
  vaccineName: string;
  targetAge: string;
  dateGiven?: string;
  status: 'COMPLETED' | 'DUE' | 'UPCOMING';
  location?: string;
  batchNumber?: string;
}

export interface MilestoneItem {
  id: string;
  childId: string;
  ageCategory: string;
  domain: 'Motorik Kasar' | 'Motorik Halus' | 'Bicara & Bahasa' | 'Sosialisasi & Kemandirian';
  description: string;
  isAchieved: boolean;
  dateAchieved?: string;
}

export interface PosyanduSchedule {
  id: string;
  posyanduName: string;
  rwRt: string;
  date: string;
  time: string;
  location: string;
  cadreLead: string;
  attendanceStatus: 'TERKONFIRMASI' | 'IZIN' | 'BELUM_KONFIRMASI';
  notes: string;
}

export interface NutritionCase {
  id: string;
  childId: string;
  childName: string;
  childAge: number;
  childGender: Gender;
  parentName: string;
  parentPhone: string;
  issueType: 'STUNTING' | 'GIZI_KURANG' | 'GIZI_BURUK' | '2T_BERTURUT' | 'BGM';
  detectedDate: string;
  status: 'TERBUKA' | 'INTERVENSI_PMT' | 'RUJUKAN_PUSKESMAS' | 'TERSELESAIKAN';
  actionNote: string;
  posyanduName: string;
}

export interface PosyanduStats {
  id: string;
  name: string;
  rw: string;
  targetChildren: number; // S (Sasaran)
  hasKms: number; // K (Punya KMS)
  weighedThisMonth: number; // D (Ditimbang)
  gainedWeight: number; // N (Naik BB)
  stuntedCount: number;
  wastedCount: number;
  pmtCount: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  target: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'INFO';
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: AppRole; // 'PARENT' | 'KADER' (Admin Posyandu)
  posyanduName: string;
  createdAt: string;
}

export interface CaptchaChallenge {
  captchaId: string;
  svg: string;
  expiresAt: number;
}

