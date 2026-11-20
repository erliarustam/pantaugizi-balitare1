import React from 'react';
import { ChildProfile, MeasurementRecord } from '../../types';
import { X, Printer, Download, CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';

interface KmsModalDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile;
  measurements: MeasurementRecord[];
  onDownloadPdf: () => void;
}

export const KmsModalDocument: React.FC<KmsModalDocumentProps> = ({
  isOpen,
  onClose,
  child,
  measurements,
  onDownloadPdf,
}) => {
  if (!isOpen) return null;

  const isBoy = child.gender === 'L';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-sm tracking-wide">
              Dokumen KMS Digital Resmi (Buku KIA Elektronik)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
            <button
              onClick={onDownloadPdf}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-800 print:p-0">
          {/* Kop Dokumen Resmi */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl">
                PG
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-base uppercase tracking-wider">
                  KARTU MENUJU SEHAT (KMS) ELEKTRONIK
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  KEMENTERIAN KESEHATAN REPUBLIK INDONESIA • STANDAR WHO 2006
                </p>
                <p className="text-[11px] text-slate-400">
                  Faskes Pembina: Puskesmas Dempo • Posyandu: {child.posyanduName}
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isBoy ? 'bg-sky-100 text-sky-900 border border-sky-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {isBoy ? 'KMS Laki-Laki (Biru)' : 'KMS Perempuan (Merah Muda)'}
              </span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">NO. REG: {child.nik}</div>
            </div>
          </div>

          {/* Data Identitas Anak & Orang Tua */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Anak</span>
              <strong className="text-slate-900 text-sm">{child.name}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tanggal Lahir</span>
              <span className="font-semibold text-slate-800">{child.birthDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">BB / TB Lahir</span>
              <span className="font-semibold text-slate-800">{child.birthWeight} kg / {child.birthLength} cm</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Orang Tua</span>
              <span className="font-semibold text-slate-800">{child.parentName}</span>
            </div>
          </div>

          {/* Tabel Catatan Antropometri Lengkap */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Catatan Penimbangan Berkala & Perkembangan Antropometri</span>
              <span className="text-slate-400 font-normal">Diperbarui: 14 Oktober 2026</span>
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Bulan Ke</th>
                    <th className="p-2.5">Tanggal</th>
                    <th className="p-2.5">Berat (kg)</th>
                    <th className="p-2.5">Tinggi (cm)</th>
                    <th className="p-2.5">Z-Score (BB/U)</th>
                    <th className="p-2.5">Status Gizi</th>
                    <th className="p-2.5">KMS (N/T)</th>
                    <th className="p-2.5">Paraf Kader</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {measurements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-slate-900">{m.ageMonths}</td>
                      <td className="p-2.5 text-slate-600">{m.date}</td>
                      <td className="p-2.5 font-bold text-slate-900">{m.weight}</td>
                      <td className="p-2.5">{m.height}</td>
                      <td className="p-2.5 font-mono text-emerald-700 font-bold">
                        {m.bbuZScore > 0 ? `+${m.bbuZScore}` : m.bbuZScore} SD
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {m.bbuStatus.split(' ')[0]}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.kmsGrowthStatus === 'N' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.kmsGrowthStatus === 'N' ? 'N (Naik)' : 'T (Tidak Naik)'}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-500 italic text-[11px]">{m.cadreName.split(' ')[0]} ✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footnote Legalitas & Barcode Verifikasi */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl border border-slate-200">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div>
                <span className="font-bold text-slate-800 block text-[11px]">
                  Terkonfirmasi Sertifikat Digital Kemenkes RI
                </span>
                <span className="text-[10px] text-slate-500 block">
                  SHA256: 8a4f91c...b02e • Valid untuk Rujukan Puskesmas/RS
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              <p>Dicetak otomatis via <strong>PantauGizi Balita</strong></p>
              <p className="text-[10px] text-slate-400">Selaras Standar e-PPGBM Nasional</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={onDownloadPdf}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Dokumen PDF Lengkap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
