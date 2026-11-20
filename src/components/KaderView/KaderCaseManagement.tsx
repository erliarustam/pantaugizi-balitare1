import React, { useState } from 'react';
import { NutritionCase } from '../../types';
import { AlertTriangle, MessageSquare, CheckCircle, ArrowRight, UserCheck, ShieldAlert, Copy, ExternalLink, Filter } from 'lucide-react';

interface KaderCaseManagementProps {
  cases: NutritionCase[];
  onUpdateCaseStatus: (caseId: string, newStatus: NutritionCase['status']) => void;
  onOpenWhatsAppModal: (c: NutritionCase) => void;
}

export const KaderCaseManagement: React.FC<KaderCaseManagementProps> = ({
  cases,
  onUpdateCaseStatus,
  onOpenWhatsAppModal,
}) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredCases = cases.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const getBadgeForType = (type: NutritionCase['issueType']) => {
    switch (type) {
      case 'STUNTING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">Stunting (PB/U &lt; -2 SD)</span>;
      case '2T_BERTURUT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">2T (2x Tidak Naik)</span>;
      case 'GIZI_KURANG':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">Gizi Kurang (Wasted)</span>;
      case 'BGM':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-900 border border-red-300">Bawah Garis Merah</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800">Kasus Khusus</span>;
    }
  };

  const getStatusBadge = (status: NutritionCase['status']) => {
    switch (status) {
      case 'TERBUKA':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">Terbuka (Perlu Tindak Lanjut)</span>;
      case 'INTERVENSI_PMT':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">Intervensi PMT 90 Hari</span>;
      case 'RUJUKAN_PUSKESMAS':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800">Dirujuk ke Puskesmas</span>;
      case 'TERSELESAIKAN':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">Teratasi (Lolos KBM)</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            Sistem Peringatan Dini & Triage
          </span>
          <h3 className="font-extrabold text-slate-900 text-lg mt-1">
            Manajemen Kasus Gizi & Intervensi Rujukan
          </h3>
          <p className="text-xs text-slate-500">
            Balita yang terdeteksi 2T, BGM, atau Z-Score di bawah -2 SD dipantau secara intensif dengan pendampingan langsung.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({cases.length})
          </button>
          <button
            onClick={() => setFilter('TERBUKA')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'TERBUKA' ? 'bg-rose-700 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terbuka ({cases.filter((c) => c.status === 'TERBUKA').length})
          </button>
          <button
            onClick={() => setFilter('INTERVENSI_PMT')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'INTERVENSI_PMT' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PMT ({cases.filter((c) => c.status === 'INTERVENSI_PMT').length})
          </button>
        </div>
      </div>

      {/* Cards Kasus */}
      <div className="space-y-4">
        {filteredCases.map((cs) => (
          <div
            key={cs.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">{cs.childName}</h4>
                    <span className="text-xs text-slate-500">({cs.childAge} Bulan, {cs.childGender === 'L' ? 'L' : 'P'})</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Wali: <strong className="text-slate-700">{cs.parentName}</strong> • WA: <span className="font-mono">{cs.parentPhone}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getBadgeForType(cs.issueType)}
                {getStatusBadge(cs.status)}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">Rencana Aksi & Catatan Posyandu:</span>
              <p className="leading-relaxed text-slate-600">{cs.actionNote}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Terdeteksi: {cs.detectedDate} • Unit: {cs.posyanduName}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Ubah Status Kasus:</span>
                <select
                  value={cs.status}
                  onChange={(e) => onUpdateCaseStatus(cs.id, e.target.value as NutritionCase['status'])}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="TERBUKA">Terbuka</option>
                  <option value="INTERVENSI_PMT">Intervensi PMT 90 Hari</option>
                  <option value="RUJUKAN_PUSKESMAS">Rujuk ke Puskesmas</option>
                  <option value="TERSELESAIKAN">Terselesaikan (Sembuh)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenWhatsAppModal(cs)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Pesan WhatsApp Orang Tua</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredCases.length === 0 && (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">Tidak ada kasus pada kategori ini</h4>
            <p className="text-xs text-slate-500 mt-1">Seluruh balita terpantau berada pada kondisi memuaskan.</p>
          </div>
        )}
      </div>
    </div>
  );
};
