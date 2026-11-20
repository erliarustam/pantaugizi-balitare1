import React, { useState } from 'react';
import { X, Download, FileCode, ExternalLink, Check, Copy, Laptop, FolderArchive } from 'lucide-react';

interface DownloadPrototypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerNotification: (msg: string) => void;
}

export const DownloadPrototypeModal: React.FC<DownloadPrototypeModalProps> = ({
  isOpen,
  onClose,
  onTriggerNotification,
}) => {
  if (!isOpen) return null;

  const [copiedCmd, setCopiedCmd] = useState(false);

  const handleDownloadStandaloneHtml = () => {
    // Download directly via a hidden anchor pointing to /PantauGizi_Balita_Prototype.html
    const link = document.createElement('a');
    link.href = '/PantauGizi_Balita_Prototype.html';
    link.download = 'PantauGizi_Balita_Prototype.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerNotification('File prototype standalone "PantauGizi_Balita_Prototype.html" berhasil diunduh ke komputer Anda!');
  };

  const handleOpenInNewTab = () => {
    window.open('/PantauGizi_Balita_Prototype.html', '_blank');
  };

  const runCommand = 'npm install && npm run dev';

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(runCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
    onTriggerNotification('Perintah terminal disalin ke clipboard.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold text-base">Unduh & Akses File Prototype</h3>
              <p className="text-xs text-emerald-100">PantauGizi Balita • Standar WHO 2006 & Permenkes RI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Opsi 1: File HTML Mandiri (Standalone) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-extrabold flex items-center justify-center text-xs">
                1
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">
                File HTML Mandiri (Bisa Langsung Dibuka Offline)
              </h4>
            </div>
            <p className="text-slate-600 leading-relaxed">
              File single-file <strong>PantauGizi_Balita_Prototype.html</strong> yang berisi seluruh antarmuka interaktif: 
              2 Peran (Orang Tua &amp; Kader Posyandu), Kurva KMS WHO, kalkulator Z-score live, simulator WhatsApp, dan ekspor data tanpa perlu instalasi Node.js apa pun.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleDownloadStandaloneHtml}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File HTML (.html)</span>
              </button>
              <button
                onClick={handleOpenInNewTab}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Buka di Tab Baru</span>
              </button>
            </div>
          </div>

          {/* Opsi 2: Source Code Proyek Lengkap (React 19 + TypeScript + Vite) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-800 text-white font-extrabold flex items-center justify-center text-xs">
                2
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Struktur Source Code Proyek (React 19 + Vite + TypeScript)
              </h4>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Seluruh kode sumber modular aplikasi ini tersimpan rapi di dalam proyek:
            </p>
            <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1 text-slate-800">
              <div className="text-emerald-700 font-bold">📂 src/</div>
              <div className="pl-4">├── <strong>App.tsx</strong> (Master State & Sub-nav Controller)</div>
              <div className="pl-4">├── <strong>types/index.ts</strong> (Definisi Data Model WHO & Balita)</div>
              <div className="pl-4">├── <strong>utils/whoStandards.ts</strong> (Mesin Kalkulasi Z-Score WHO 2006)</div>
              <div className="pl-4">├── <strong>data/initialData.ts</strong> (Dataset Realistis Anak & Posyandu)</div>
              <div className="pl-4">├── <strong>components/ParentView/</strong> (KMS Digital, Kurva SVG, Imunisasi)</div>
              <div className="pl-4">└── <strong>components/KaderView/</strong> (Input Form Z-Score, SKDN, Kasus 2T)</div>
            </div>

            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl border border-slate-200">
              <span className="font-mono text-[11px] text-slate-700">{runCommand}</span>
              <button
                onClick={handleCopyCmd}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? 'Tersalin' : 'Salin Perintah'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
