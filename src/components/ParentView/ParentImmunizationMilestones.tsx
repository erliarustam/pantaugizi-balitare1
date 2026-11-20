import React, { useState } from 'react';
import { ImmunizationItem, MilestoneItem, ChildProfile } from '../../types';
import { Syringe, CheckCircle2, Circle, Sparkles, Shield, Clock, HelpCircle, Check, AlertCircle } from 'lucide-react';

interface ParentImmunizationMilestonesProps {
  child: ChildProfile;
  immunizations: ImmunizationItem[];
  milestones: MilestoneItem[];
  onToggleMilestone: (id: string) => void;
  onUpdateImmunization: (id: string) => void;
}

export const ParentImmunizationMilestones: React.FC<ParentImmunizationMilestonesProps> = ({
  child,
  immunizations,
  milestones,
  onToggleMilestone,
  onUpdateImmunization,
}) => {
  const [activeTab, setActiveTab] = useState<'immunization' | 'milestone'>('immunization');

  const completedImmunizations = immunizations.filter((i) => i.status === 'COMPLETED').length;
  const totalImmunizations = immunizations.length;
  const achievedMilestones = milestones.filter((m) => m.isAchieved).length;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {/* Switcher Tab */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Perlindungan & Tumbuh Kembang 1000 HPK
          </span>
          <h3 className="font-extrabold text-slate-900 text-lg mt-1">
            Status Imunisasi & Pencapaian Milestone Anak
          </h3>
          <p className="text-xs text-slate-500">
            Pemantauan berkala kekebalan tubuh dan stimulasi tumbuh kembang balita sesuai panduan Buku KIA Kemenkes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('immunization')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'immunization'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>Imunisasi ({completedImmunizations}/{totalImmunizations})</span>
          </button>
          <button
            onClick={() => setActiveTab('milestone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'milestone'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Milestone Kembang ({achievedMilestones}/{milestones.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Imunisasi */}
      {activeTab === 'immunization' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-emerald-900 block text-sm">
                  Cakupan Imunisasi Dasar Lengkap: {Math.round((completedImmunizations / totalImmunizations) * 100)}%
                </span>
                <span className="text-emerald-700 text-xs">
                  {completedImmunizations} dari {totalImmunizations} dosis vaksin esensial telah diterima sesuai jadwal.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider">
              Terverifikasi Faskes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {immunizations.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  item.status === 'COMPLETED'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Jadwal Rekomendasi: {item.targetAge}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {item.vaccineName}
                    </h4>
                    {item.location && (
                      <p className="text-[11px] text-slate-500">
                        Lokasi: {item.location} • Batch: <span className="font-mono">{item.batchNumber}</span>
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      item.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'DUE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status === 'COMPLETED'
                      ? 'Selesai'
                      : item.status === 'DUE'
                      ? 'Jadwal Tiba'
                      : 'Mendatang'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {item.dateGiven ? `Diberikan: ${item.dateGiven}` : 'Belum diberikan'}
                  </span>
                  <button
                    onClick={() => onUpdateImmunization(item.id)}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    {item.status === 'COMPLETED' ? 'Lihat Detail Vaksin' : 'Konfirmasi Sudah Diberikan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Milestone Perkembangan (KPSP) */}
      {activeTab === 'milestone' && (
        <div className="space-y-4">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div>
              <span className="font-bold text-teal-900 block text-sm">
                Skrining KPSP Usia 12 - 15 Bulan
              </span>
              <span className="text-teal-700 text-xs">
                Centang setiap kemampuan yang sudah mampu dilakukan secara mandiri oleh anak di rumah.
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-teal-700 block">Hasil Skrining</span>
              <strong className="text-sm text-teal-900 font-bold">
                {achievedMilestones >= 3 ? 'Perkembangan Sesuai (S)' : 'Perlu Stimulasi Tambahan (M)'}
              </strong>
            </div>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                onClick={() => onToggleMilestone(m.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  m.isAchieved
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  m.isAchieved ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 text-transparent'
                }`}>
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                      {m.domain}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{m.ageCategory}</span>
                  </div>
                  <p className={`text-xs font-semibold ${m.isAchieved ? 'text-emerald-950' : 'text-slate-800'}`}>
                    {m.description}
                  </p>
                  {m.dateAchieved && (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      ✓ Tercapai pada: {m.dateAchieved}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
