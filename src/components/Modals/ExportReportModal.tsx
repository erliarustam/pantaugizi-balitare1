import React, { useState } from 'react';
import { ChildProfile, MeasurementRecord, PosyanduStats } from '../../types';
import { X, Download, FileSpreadsheet, Check, Copy } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenList: ChildProfile[];
  measurements: MeasurementRecord[];
  onTriggerNotification: (msg: string) => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  childrenList,
  measurements,
  onTriggerNotification,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Buat CSV string
  const headers = ['No', 'NIK', 'Nama Balita', 'Tanggal Lahir', 'JK', 'Nama Orang Tua', 'BB (kg)', 'TB (cm)', 'Cara Ukur', 'LiLA (cm)', 'Z-Score BB/U', 'Status BB/U', 'Z-Score PB/U', 'Status Stunting', 'Status KMS'];
  
  const rows = childrenList.map((child, idx) => {
    const latest = measurements
      .filter((m) => m.childId === child.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return [
      idx + 1,
      child.nik,
      child.name,
      child.birthDate,
      child.gender,
      child.parentName,
      latest ? latest.weight : '-',
      latest ? latest.height : '-',
      latest ? (latest.measureMode === 'LYING' ? 'Terlentang' : 'Berdiri') : '-',
      latest ? (latest.upperArmCircumference || '-') : '-',
      latest ? (latest.bbuZScore > 0 ? `+${latest.bbuZScore}` : latest.bbuZScore) : '-',
      latest ? latest.bbuStatus : '-',
      latest ? (latest.pbuZScore > 0 ? `+${latest.pbuZScore}` : latest.pbuZScore) : '-',
      latest ? latest.pbuStatus : '-',
      latest ? latest.kmsGrowthStatus : '-',
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onTriggerNotification('Format CSV e-PPGBM berhasil disalin ke clipboard.');
  };

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ePPGBM_PuskesmasDempo_Oktober2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerNotification('File CSV e-PPGBM berhasil diunduh.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-sm sm:text-base">
              Ekspor Data Format Resmi e-PPGBM (Kemenkes RI)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="flex justify-between items-center">
            <p className="text-slate-600">
              Format data disesuaikan dengan template unggah batch sistem <strong>e-PPGBM (Elektronik Pencatatan dan Pelaporan Gizi Berbasis Masyarakat)</strong> Kemenkes RI.
            </p>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
              {childrenList.length} Baris Data Siap Diunggah
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-72">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="p-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {row.map((cell, j) => (
                      <td key={j} className="p-2.5 whitespace-nowrap font-sans">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center gap-3">
          <button
            onClick={handleCopyCsv}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin' : 'Salin Format CSV'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File CSV / Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
