import React from 'react';
import { X, CheckCircle2, Ruler, Scale, Heart, Info, BookOpen } from 'lucide-react';

interface MeasurementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-emerald-800 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-300" />
            <h3 className="font-extrabold text-sm sm:text-base">
              Panduan Antropometri & 5 Langkah Posyandu Terpadu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* 5 Langkah Posyandu */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider text-emerald-800">
              Alur 5 Langkah Posyandu Kemenkes RI:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center mx-auto text-[11px]">1</span>
                <strong className="block text-[11px] text-slate-900">Pendaftaran</strong>
                <span className="text-[10px] text-slate-500">Registrasi Buku KIA & NIK</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center mx-auto text-[11px]">2</span>
                <strong className="block text-[11px] text-emerald-950">Penimbangan</strong>
                <span className="text-[10px] text-emerald-700">BB, PB/TB, LiLA, LK</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center mx-auto text-[11px]">3</span>
                <strong className="block text-[11px] text-slate-900">Pencatatan</strong>
                <span className="text-[10px] text-slate-500">Plotting KMS & Z-Score</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center mx-auto text-[11px]">4</span>
                <strong className="block text-[11px] text-slate-900">Penyuluhan</strong>
                <span className="text-[10px] text-slate-500">Konseling Gizi & PMT</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center mx-auto text-[11px]">5</span>
                <strong className="block text-[11px] text-slate-900">Pelayanan</strong>
                <span className="text-[10px] text-slate-500">Imunisasi & Vit A</span>
              </div>
            </div>
          </div>

          {/* Standar Alat Ukur Terkalibrasi */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Pedoman Pengukuran Panjang / Tinggi Badan (WHO 2006):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Ruler className="w-4 h-4" />
                  <span>Anak &lt; 24 Bulan: Posisi Terlentang</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Gunakan <strong>Infantometer (Papan Ukur Panjang Badan)</strong> beralas datar. Kepala anak menempel pada batas atas, pandangan lurus ke langit-langit (bidang Frankfort), kedua lutut ditekan lembut agar lurus, dan telapak kaki tegak menempel pada papan geser.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Ruler className="w-4 h-4" />
                  <span>Anak ≥ 24 Bulan: Posisi Berdiri</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Gunakan <strong>Stadiometer</strong> tegak lurus lantai. Anak berdiri tegak tanpa alas kaki. Pastikan 5 titik tubuh menempel rapat pada tiang stadiometer: bagian belakang kepala, punggung atas, bokong, betis, dan kedua tumit kaki.
                </p>
              </div>
            </div>
          </div>

          {/* Cara Pengukuran LiLA */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <strong className="font-bold text-emerald-950 block">
              Cara Pengukuran Lingkar Lengan Atas (LiLA) Balita:
            </strong>
            <p className="text-emerald-800 leading-relaxed">
              1. Tentukan titik tengah antara puncak bahu (akromion) dan siku (olekranon) pada lengan kiri yang ditekuk 90 derajat.<br />
              2. Luruskan kembali lengan anak, lingkarkan pita LiLA tanpa terlalu ketat atau longgar.<br />
              3. Baca angka pada jendela pita: <strong>Hijau (&gt;12.5 cm)</strong> Normal, <strong>Kuning (11.5 - 12.5 cm)</strong> Waspada Gizi Kurang, <strong>Merah (&lt;11.5 cm)</strong> Gizi Buruk (Segera Rujuk ke Dokter Puskesmas).
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
