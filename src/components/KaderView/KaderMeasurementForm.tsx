import React, { useState, useEffect } from 'react';
import { ChildProfile, MeasurementRecord, MeasureMode } from '../../types';
import { calculateBbuZScore, calculatePbuZScore, calculateBbpbZScore, evaluateLila, evaluateKmsGrowth } from '../../utils/whoStandards';
import { Scale, Ruler, HeartPulse, Check, ArrowLeft, ShieldAlert, Sparkles, AlertCircle, Info } from 'lucide-react';

interface KaderMeasurementFormProps {
  childrenList: ChildProfile[];
  initialChildId?: string;
  previousMeasurements: MeasurementRecord[];
  onSaveMeasurement: (record: MeasurementRecord) => void;
  onCancel: () => void;
}

export const KaderMeasurementForm: React.FC<KaderMeasurementFormProps> = ({
  childrenList,
  initialChildId,
  previousMeasurements,
  onSaveMeasurement,
  onCancel,
}) => {
  const [selectedChildId, setSelectedChildId] = useState<string>(initialChildId || childrenList[0]?.id || '');
  const [date, setDate] = useState('2026-10-17');
  const [weight, setWeight] = useState<number>(10.1);
  const [height, setHeight] = useState<number>(78.5);
  const [measureMode, setMeasureMode] = useState<MeasureMode>('LYING');
  const [headCircumference, setHeadCircumference] = useState<number>(46.5);
  const [upperArmCircumference, setUpperArmCircumference] = useState<number>(14.5);
  const [hasEdema, setHasEdema] = useState(false);
  const [cadreName, setCadreName] = useState('Ibu Siti (Kader Posyandu)');
  const [notes, setNotes] = useState('');

  const selectedChild = childrenList.find((c) => c.id === selectedChildId);

  // Estimasi usia bulan
  const calculateAgeMonths = (birthDateStr: string, measureDateStr: string) => {
    const birth = new Date(birthDateStr);
    const measure = new Date(measureDateStr);
    const diffTime = measure.getTime() - birth.getTime();
    const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375));
    return Math.max(0, months);
  };

  const ageMonths = selectedChild ? calculateAgeMonths(selectedChild.birthDate, date) : 14;

  // Set default cara ukur berdasarkan usia
  useEffect(() => {
    if (ageMonths < 24) {
      setMeasureMode('LYING');
    } else {
      setMeasureMode('STANDING');
    }
  }, [ageMonths]);

  // Ambil pengukuran bulan lalu
  const childPastRecords = previousMeasurements
    .filter((m) => m.childId === selectedChildId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const prevRecord = childPastRecords[0];

  // Kalkulasi Live WHO Antropometri
  const gender = selectedChild?.gender || 'L';
  const bbuResult = calculateBbuZScore(gender, ageMonths, weight);
  const pbuResult = calculatePbuZScore(gender, ageMonths, height, measureMode);
  const bbpbResult = calculateBbpbZScore(gender, weight, height);
  const lilaResult = evaluateLila(upperArmCircumference);
  const growthResult = evaluateKmsGrowth(weight, prevRecord?.weight, ageMonths);

  // Evaluasi 2T (dua kali tidak naik berturut-turut)
  const is2T = growthResult.status === 'T' && prevRecord?.kmsGrowthStatus === 'T';
  const isStunted = pbuResult.zScore < -2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    const newRecord: MeasurementRecord = {
      id: `ms-${Date.now()}`,
      childId: selectedChild.id,
      date,
      ageMonths,
      weight,
      height,
      measureMode,
      headCircumference,
      upperArmCircumference,
      hasEdema,
      notes: notes || (growthResult.status === 'N' ? 'Pertumbuhan baik, anak kooperatif.' : 'Perlu pemantauan asupan makan.'),
      cadreName,
      posyanduName: selectedChild.posyanduName,
      bbuZScore: bbuResult.zScore,
      bbuStatus: bbuResult.status,
      pbuZScore: pbuResult.zScore,
      pbuStatus: pbuResult.status,
      bbpbZScore: bbpbResult.zScore,
      bbpbStatus: bbpbResult.status,
      lilaStatus: lilaResult,
      kmsGrowthStatus: growthResult.status,
      weightDiff: growthResult.diff,
    };

    onSaveMeasurement(newRecord);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Formulir Langkah 2 & 3 Posyandu
          </span>
          <h3 className="font-extrabold text-slate-900 text-lg mt-1">
            Input Pengukuran Antropometri & Kalkulator Z-Score WHO
          </h3>
          <p className="text-xs text-slate-500">
            Evaluasi otomatis standar Permenkes RI No. 2/2020 begitu data antropometri dimasukkan.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Pilih Balita */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Pilih Balita yang Ditimbang
          </label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full text-xs font-bold p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500"
          >
            {childrenList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — NIK: {c.nik} ({c.gender === 'L' ? 'Laki-laki' : 'Perempuan'}, Usia: {calculateAgeMonths(c.birthDate, date)} Bulan)
              </option>
            ))}
          </select>
          {prevRecord && (
            <p className="text-[11px] text-slate-500 mt-1">
              Catatan bulan lalu ({prevRecord.date}): BB <strong>{prevRecord.weight} kg</strong>, PB <strong>{prevRecord.height} cm</strong> ({prevRecord.kmsGrowthStatus === 'N' ? 'Naik' : 'Tidak Naik'}).
            </p>
          )}
        </div>

        {/* Tanggal & Cara Ukur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tanggal Pengukuran
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Metode Pengukuran (WHO Rule)
            </label>
            <select
              value={measureMode}
              onChange={(e) => setMeasureMode(e.target.value as MeasureMode)}
              className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="LYING">Terlentang (Infantometer - Wajib jika &lt; 24 Bulan)</option>
              <option value="STANDING">Berdiri (Stadiometer - Wajib jika ≥ 24 Bulan)</option>
            </select>
          </div>
        </div>

        {/* Input Berat & Panjang/Tinggi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Berat Badan (kg)</span>
              </label>
              <span className="text-[10px] text-slate-400">Ketelitian 0.05 kg</span>
            </div>
            <input
              type="number"
              step="0.05"
              min="1.5"
              max="35"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full text-lg font-black p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              required
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Selisih bln lalu:</span>
              <strong className={growthResult.diff >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                {growthResult.diff >= 0 ? `+${growthResult.diff}` : growthResult.diff} kg (KBM: {growthResult.kbmMin} gr)
              </strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-emerald-600" />
                <span>Panjang / Tinggi Badan (cm)</span>
              </label>
              <span className="text-[10px] text-slate-400">Ketelitian 0.1 cm</span>
            </div>
            <input
              type="number"
              step="0.1"
              min="40"
              max="130"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full text-lg font-black p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              required
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Penyesuaian WHO:</span>
              <span className="text-slate-700 font-medium">
                {ageMonths < 24 && measureMode === 'STANDING' ? 'Koreksi: +0.7 cm' : 'Sesuai Standar'}
              </span>
            </div>
          </div>
        </div>

        {/* Input LiLA & Lingkar Kepala */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lingkar Lengan Atas (LiLA, cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={upperArmCircumference}
              onChange={(e) => setUpperArmCircumference(parseFloat(e.target.value) || 0)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Pita LiLA Kemenkes: Hijau (&gt;12.5 cm) | Kuning (11.5 - 12.5 cm) | Merah (&lt;11.5 cm)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lingkar Kepala (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={headCircumference}
              onChange={(e) => setHeadCircumference(parseFloat(e.target.value) || 0)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Deteksi dini Mikrosefali / Makrosefali
            </span>
          </div>
        </div>

        {/* Checkbox Edema Klinis Kwashiorkor */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 text-xs block">
              Pemeriksaan Edema Bilateral Pitting (+ / -)
            </span>
            <span className="text-[11px] text-slate-500">
              Tekan kedua punggung kaki anak selama 3 detik. Ada cekungan menetap?
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hasEdema}
              onChange={(e) => setHasEdema(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {/* Live Z-Score Result Panel (WHO Certified) */}
        <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Hasil Analisis Otomatis Standar WHO 2006 (Permenkes 2/2020)</span>
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-700 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
              Live Engine
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">BB/U Z-Score</span>
              <strong className="text-slate-900 text-sm font-black font-mono">
                {bbuResult.zScore > 0 ? `+${bbuResult.zScore}` : bbuResult.zScore} SD
              </strong>
              <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">
                {bbuResult.status}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">PB/U (Stunting)</span>
              <strong className="text-slate-900 text-sm font-black font-mono">
                {pbuResult.zScore > 0 ? `+${pbuResult.zScore}` : pbuResult.zScore} SD
              </strong>
              <span className={`block text-[10px] font-bold mt-0.5 ${pbuResult.zScore < -2 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {pbuResult.status.split(' ')[0]}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">BB/PB (Wasting)</span>
              <strong className="text-slate-900 text-sm font-black font-mono">
                {bbpbResult.zScore > 0 ? `+${bbpbResult.zScore}` : bbpbResult.zScore} SD
              </strong>
              <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">
                {bbpbResult.status.split(' ')[0]}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block">Status KMS</span>
              <strong className="text-slate-900 text-sm font-black">
                {growthResult.status === 'N' ? 'Naik (N)' : 'Tidak Naik (T)'}
              </strong>
              <span className={`block text-[10px] font-bold mt-0.5 ${growthResult.status === 'N' ? 'text-emerald-700' : 'text-amber-600'}`}>
                {growthResult.diff >= 0 ? `+${growthResult.diff} kg` : `${growthResult.diff} kg`}
              </span>
            </div>
          </div>

          {/* Alert Peringatan 2T atau Stunting */}
          {(is2T || isStunted || hasEdema) && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3 text-xs text-rose-900 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">
                  ⚠️ Peringatan Klinis Posyandu Terdeteksi:
                </strong>
                <p className="mt-0.5 leading-relaxed text-rose-800">
                  {is2T && '• Balita mengalami kenaikan berat badan di bawah KBM 2 kali berturut-turut (2T). '}
                  {isStunted && '• Z-score PB/U < -2 SD (Kategori Pendek / Stunted). '}
                  {hasEdema && '• Ditemukan tanda klinis edema bilateral (Indikasi Gizi Buruk). '}
                  Sistem otomatis merekomendasikan rujukan ke Puskesmas dan pembuatan pesan WhatsApp konfirmasi ke orang tua.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Catatan Kader & Nama Petugas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Kader yang Mengukur
            </label>
            <input
              type="text"
              value={cadreName}
              onChange={(e) => setCadreName(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Khusus Perkembangan Balita
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Anak sedang tumbuh gigi, nafsu makan baik..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Simpan & Sinkronkan Antropometri</span>
          </button>
        </div>
      </form>
    </div>
  );
};
