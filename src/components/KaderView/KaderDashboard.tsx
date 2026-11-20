import React, { useState } from 'react';
import { ChildProfile, MeasurementRecord } from '../../types';
import { Users, Scale, AlertTriangle, TrendingUp, Search, Plus, FileText, ArrowRight, CheckCircle2, ChevronRight, UserPlus, HeartHandshake } from 'lucide-react';

interface KaderDashboardProps {
  childrenList: ChildProfile[];
  measurements: MeasurementRecord[];
  onOpenMeasureForm: (childId?: string) => void;
  onOpenRegisterForm: () => void;
  onSelectChildForDetail: (child: ChildProfile) => void;
  onOpenCaseModal: () => void;
}

export const KaderDashboard: React.FC<KaderDashboardProps> = ({
  childrenList,
  measurements,
  onOpenMeasureForm,
  onOpenRegisterForm,
  onSelectChildForDetail,
  onOpenCaseModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WEIGHED' | 'UNWEIGHED' | 'RISK'>('ALL');

  // Hitung SKDN Posyandu Melati A1
  const totalTarget = childrenList.length; // S
  const hasKms = childrenList.filter((c) => c.hasKiaBook).length; // K
  
  // Balita yang sudah punya record di bulan ini (Oktober 2026)
  const weighedIds = new Set(measurements.filter((m) => m.date.startsWith('2026-10')).map((m) => m.childId));
  const weighedCount = childrenList.filter((c) => weighedIds.has(c.id)).length; // D
  
  // Balita yang N (Naik)
  const gainedCount = measurements.filter((m) => m.date.startsWith('2026-10') && m.kmsGrowthStatus === 'N').length; // N

  // Balita berisiko (Z-score < -2 atau status T)
  const riskIds = new Set(
    measurements.filter((m) => m.date.startsWith('2026-10') && (m.bbuZScore < -2 || m.pbuZScore < -2 || m.kmsGrowthStatus === 'T')).map((m) => m.childId)
  );

  // Filter daftar balita
  const filteredChildren = childrenList.filter((child) => {
    const matchSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) || child.nik.includes(searchTerm);
    if (!matchSearch) return false;

    if (statusFilter === 'WEIGHED') return weighedIds.has(child.id);
    if (statusFilter === 'UNWEIGHED') return !weighedIds.has(child.id);
    if (statusFilter === 'RISK') return riskIds.has(child.id);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner SKDN Kemenkes Posyandu */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sasaran Balita (S)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalTarget} Anak</div>
          <div className="text-[11px] text-slate-400 mt-1">KMS Terdaftar: {hasKms} (100%)</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ditimbang (D / S)</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {weighedCount} <span className="text-sm font-semibold text-slate-500">/ {totalTarget}</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            Cakupan: {Math.round((weighedCount / (totalTarget || 1)) * 100)}% (Target: &gt;85%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tumbuh Naik (N / D)</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {gainedCount} <span className="text-sm font-semibold text-slate-500">/ {weighedCount}</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            Efektivitas: {Math.round((gainedCount / (weighedCount || 1)) * 100)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center justify-between">
            <span>Perhatian Khusus</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {riskIds.size} Kasus
          </div>
          <button
            onClick={onOpenCaseModal}
            className="text-[11px] text-amber-800 font-bold hover:underline mt-1 block cursor-pointer"
          >
            Lihat Kasus 2T & PMT →
          </button>
        </div>
      </div>

      {/* Main Action Bar & Daftar Balita */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Manajemen Data Balita • Posyandu Melati A1
            </h3>
            <p className="text-xs text-slate-500">
              Lakukan pencatatan 5 Langkah Posyandu: Pendaftaran, Penimbangan, Pencatatan, Penyuluhan, Pelayanan Kesehatan.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => onOpenMeasureForm()}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>+ Input Ukur Cepat</span>
            </button>
            <button
              onClick={onOpenRegisterForm}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Daftarkan Balita Baru</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama balita atau NIK..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({childrenList.length})
            </button>
            <button
              onClick={() => setStatusFilter('WEIGHED')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'WEIGHED' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sudah Ditimbang ({weighedCount})
            </button>
            <button
              onClick={() => setStatusFilter('UNWEIGHED')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'UNWEIGHED' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Belum Ditimbang ({totalTarget - weighedCount})
            </button>
            <button
              onClick={() => setStatusFilter('RISK')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'RISK' ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Perlu Intervensi ({riskIds.size})
            </button>
          </div>
        </div>

        {/* Tabel Data Balita */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Nama Balita</th>
                <th className="p-3">JK / Usia</th>
                <th className="p-3">Orang Tua / Kontak</th>
                <th className="p-3">Pengukuran Terakhir</th>
                <th className="p-3">Status Gizi (WHO)</th>
                <th className="p-3 text-right">Aksi Kader</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChildren.map((child) => {
                const childMeasurements = measurements
                  .filter((m) => m.childId === child.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const latest = childMeasurements[0];
                const isWeighed = latest && latest.date.startsWith('2026-10');

                return (
                  <tr key={child.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${child.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold">{child.name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">NIK: {child.nik}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        child.gender === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {child.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                      <div className="text-slate-600 font-medium mt-0.5">
                        {latest ? `${latest.ageMonths} Bulan` : 'Baru'}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="text-slate-800 font-medium block">{child.parentName}</span>
                      <span className="text-[10px] text-slate-400">{child.parentPhone}</span>
                    </td>

                    <td className="p-3">
                      {latest ? (
                        <div>
                          <strong className="text-slate-900">{latest.weight} kg</strong> • <span>{latest.height} cm</span>
                          <span className="block text-[10px] text-slate-400">{latest.date}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum ada data</span>
                      )}
                    </td>

                    <td className="p-3">
                      {latest ? (
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            latest.bbuStatus.includes('Baik')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {latest.bbuStatus.split(' ')[0]} ({latest.bbuZScore > 0 ? `+${latest.bbuZScore}` : latest.bbuZScore} SD)
                          </span>
                          {latest.pbuStatus.includes('Stunted') && (
                            <span className="block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              ⚠️ Stunted
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => onOpenMeasureForm(child.id)}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition cursor-pointer"
                      >
                        + Input Ukur
                      </button>
                      <button
                        onClick={() => onSelectChildForDetail(child)}
                        className="px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-xs transition cursor-pointer"
                      >
                        KMS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
