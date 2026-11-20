import React, { useState } from 'react';
import { NutritionCase } from '../../types';
import { X, Send, Copy, Check, MessageSquare, PhoneCall } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCase: NutritionCase | null;
  onSendMessage: (msg: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  targetCase,
  onSendMessage,
}) => {
  if (!isOpen || !targetCase) return null;

  const defaultText = `Assalamu'alaikum Wr. Wb. / Salam Sehat Ibu ${targetCase.parentName},\n\nKami dari Kader Posyandu Melati A1 ingin menyampaikan hasil penimbangan ananda *${targetCase.childName}* (Usia ${targetCase.childAge} bulan) pada periode Oktober 2026.\n\nBerdasarkan standar antropometri WHO, ananda memerlukan sedikit perhatian khusus pada kenaikan berat badan/tinggi badan. Oleh karena itu, kami mengundang Ibu untuk:\n1. Konsultasi gizi santai bersama Nutrisionis Puskesmas\n2. Menerima paket Pemberian Makanan Tambahan (PMT) Pemulihan Pangan Lokal (nugget tempe hati ayam & telur)\n\n📍 Jadwal: Sabtu, 14 November 2026 (Pukul 08.30 WIB)\nLokasi: Balai Warga RT 04 (Depan Masjid Al-Ikhlas)\n\nMari bersama kita dukung tumbuh kembang ananda agar sehat, cerdas, dan aktif! Terima kasih, Bu. 🙏\n- Kader Posyandu Melati A1 & Puskesmas Dempo`;

  const [messageText, setMessageText] = useState(defaultText);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSend = () => {
    onSendMessage(`Pesan WhatsApp berhasil dikirimkan ke nomor ${targetCase.parentPhone} (${targetCase.parentName})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header WhatsApp Green */}
        <div className="bg-[#075E54] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              WA
            </div>
            <div>
              <h3 className="font-bold text-sm">WhatsApp Intervensi Posyandu</h3>
              <p className="text-[11px] text-emerald-100">
                Penerima: {targetCase.parentName} ({targetCase.parentPhone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat UI Body */}
        <div className="p-5 bg-[#EFEAE2] space-y-4">
          <div className="bg-white p-4 rounded-2xl rounded-tl-xs shadow-sm border border-slate-200/60 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[10px] text-slate-400">
              <span className="font-bold text-emerald-800">Draf Pesan Resmi Kader Posyandu</span>
              <span>Hari ini, 09.41 WIB</span>
            </div>
            <textarea
              rows={8}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full text-xs text-slate-800 bg-transparent resize-none focus:outline-none leading-relaxed font-sans"
            />
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Pesan ini dapat diedit langsung sebelum dikirimkan ke nomor WhatsApp orang tua.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSend}
              className="px-5 py-2 bg-[#25D366] hover:bg-[#1eb956] text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pesan WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
