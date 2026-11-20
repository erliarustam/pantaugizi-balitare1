import React from 'react';
import { ChildProfile, MeasurementRecord, PosyanduSchedule } from '../../types';
import { FileText, Download, Calendar, MapPin, CheckCircle2, AlertCircle, ArrowUpRight, TrendingUp, HeartHandshake, BellRing } from 'lucide-react';

interface ParentOverviewProps {
  childrenList: ChildProfile[];
  selectedChild: ChildProfile;
  onSelectChild: (child: ChildProfile) => void;
  latestMeasurement?: MeasurementRecord;
  schedules: PosyanduSchedule[];
  onOpenKmsModal: () => void;
  onDownloadPdf: () => void;
  onSetReminder: (schedule: PosyanduSchedule) => void;
  onToggleRsvp: (scheduleId: string) => void;
}

export const ParentOverview: React.FC<ParentOverviewProps> = ({
  childrenList,
  selectedChild,
  onSelectChild,
  latestMeasurement,
  schedules,
  onOpenKmsModal,
  onDownloadPdf,
  onSetReminder,
  onToggleRsvp,
}) => {
  const currentSchedule = schedules[0];

  return (
    <div className="space-y-6">
      {/* Profil Header Balita & Pemilih Anak */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedChild.avatarColor} text-white flex items-center justify-center font-extrabold text-xl shadow-md`}>
            {selectedChild.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Buku KIA Terdaftar • {selectedChild.gender === 'L' ? 'KMS Biru (Laki-laki)' : 'KMS Pink (Perempuan)'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <select
                value={selectedChild.id}
                onChange={(e) => {
                  const target = childrenList.find((c) => c.id === e.target.value);
                  if (target) onSelectChild(target);
                }}
                className="font-bold text-slate-900 text-lg bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {childrenList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.gender === 'L' ? 'L' : 'P'}, Lahir: {c.birthDate})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              NIK: <span className="font-mono text-slate-700">{selectedChild.nik}</span> • Wali: {selectedChild.parentName} ({selectedChild.rt}/{selectedChild.rw})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={onOpenKmsModal}
            className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Lihat Lembar KMS Lengkap</span>
          </button>
          <button
            onClick={onDownloadPdf}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Grid Indikator Antropometri Tri-Parameter WHO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BB / U */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Berat Badan / Usia (BB/U)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              latestMeasurement?.bbuStatus.includes('Baik')
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {latestMeasurement?.bbuZScore !== undefined ? `${latestMeasurement.bbuZScore > 0 ? '+' : ''}${latestMeasurement.bbuZScore} SD` : '-'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {latestMeasurement?.bbuStatus || 'Belum Diukur'}
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center gap-2">
            <span className="font-bold text-slate-900">{latestMeasurement?.weight || 0} kg</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-700 font-medium">
              KMS: {latestMeasurement?.kmsGrowthStatus === 'N' ? 'Tumbuh Naik (N)' : 'Perlu Evaluasi (T)'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Standar WHO 2006</span>
            <span className="text-slate-500 font-medium">Bulan ke-{latestMeasurement?.ageMonths || 0}</span>
          </div>
        </div>

        {/* PB/TB / U (Stunting Indicator) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Panjang / Tinggi (PB/U)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              latestMeasurement?.pbuStatus === 'Normal'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {latestMeasurement?.pbuZScore !== undefined ? `${latestMeasurement.pbuZScore > 0 ? '+' : ''}${latestMeasurement.pbuZScore} SD` : '-'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {latestMeasurement?.pbuStatus || 'Normal'}
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center gap-2">
            <span className="font-bold text-slate-900">{latestMeasurement?.height || 0} cm</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">
              Cara ukur: {latestMeasurement?.measureMode === 'LYING' ? 'Terlentang' : 'Berdiri'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Deteksi Stunting</span>
            <span className={latestMeasurement?.pbuZScore && latestMeasurement.pbuZScore < -2 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
              {latestMeasurement?.pbuZScore && latestMeasurement.pbuZScore < -2 ? 'Perlu Intervensi' : 'Aman / Optimal'}
            </span>
          </div>
        </div>

        {/* BB / PB (Wasting Indicator) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gizi Akut (BB/PB)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              latestMeasurement?.bbpbStatus.includes('Baik')
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {latestMeasurement?.bbpbZScore !== undefined ? `${latestMeasurement.bbpbZScore > 0 ? '+' : ''}${latestMeasurement.bbpbZScore} SD` : '-'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {latestMeasurement?.bbpbStatus || 'Gizi Baik'}
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center gap-2">
            <span className="text-slate-600">Proporsi Berat/Tinggi</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-700 font-medium">Bebas Edema</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Status Wasting</span>
            <span className="text-emerald-600 font-bold">Optimal</span>
          </div>
        </div>

        {/* LiLA (Lingkar Lengan Atas) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lingkar Lengan (LiLA)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Pita Hijau
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {latestMeasurement?.upperArmCircumference ? `${latestMeasurement.upperArmCircumference} cm` : '14.5 cm'}
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center gap-2">
            <span>Lingkar Kepala: <strong>{latestMeasurement?.headCircumference || 46.5} cm</strong></span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ambang Kemenkes: 11.5 cm</span>
            <span className="text-emerald-600 font-bold">Gizi Baik</span>
          </div>
        </div>
      </div>

      {/* Banner Rekomendasi Pintar & Catatan Posyandu Terakhir */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30">
                Hasil Penimbangan: {latestMeasurement?.date || '14 Okt 2026'}
              </span>
              <span className="text-xs text-emerald-200 font-medium">Petugas: {latestMeasurement?.cadreName}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold">
              {selectedChild.name} Berada Pada Status Pertumbuhan Baik
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              {latestMeasurement?.notes || 'Kondisi anak aktif dan kooperatif. Terus pertahankan asupan protein hewani ganda (telur dan ikan/daging) minimal 2 porsi sehari serta stimulasi motorik dan bicara.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 w-full md:w-auto text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">Kenaikan Berat Badan</span>
            <div className="text-2xl font-black text-white mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span>+{latestMeasurement?.weightDiff || 0.35} kg</span>
            </div>
            <span className="text-[11px] text-emerald-200 block mt-1">Melebihi KBM minimal (200 gr)</span>
          </div>
        </div>
      </div>

      {/* Jadwal Penimbangan Posyandu Terdekat & Konfirmasi RSVP */}
      {currentSchedule && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Jadwal Posyandu Balita Terdekat</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Penimbangan berkala setiap bulan untuk memantau grafik KMS anak</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              {currentSchedule.posyanduName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tanggal & Waktu</span>
              <div className="font-bold text-slate-800 text-sm">{currentSchedule.date}</div>
              <p className="text-xs text-slate-600 font-medium">{currentSchedule.time}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Lokasi & Kader</span>
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentSchedule.location}</span>
              </div>
              <p className="text-xs text-slate-500">{currentSchedule.cadreLead}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Status Kehadiran</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    currentSchedule.attendanceStatus === 'TERKONFIRMASI'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {currentSchedule.attendanceStatus === 'TERKONFIRMASI' ? 'Terkonfirmasi Hadir' : 'Belum Konfirmasi'}
                  </span>
                  <button
                    onClick={() => onToggleRsvp(currentSchedule.id)}
                    className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Ubah Status
                  </button>
                </div>
              </div>

              <button
                onClick={() => onSetReminder(currentSchedule)}
                className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Setel Pengingat WhatsApp →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
