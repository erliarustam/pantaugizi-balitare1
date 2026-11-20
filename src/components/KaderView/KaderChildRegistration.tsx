import React, { useState } from 'react';
import { ChildProfile, Gender } from '../../types';
import { UserPlus, ArrowLeft, Check, Shield, Baby, Phone, MapPin } from 'lucide-react';

interface KaderChildRegistrationProps {
  onRegisterChild: (child: ChildProfile) => void;
  onCancel: () => void;
}

export const KaderChildRegistration: React.FC<KaderChildRegistrationProps> = ({
  onRegisterChild,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [birthDate, setBirthDate] = useState('2025-08-14');
  const [gender, setGender] = useState<Gender>('L');
  const [birthWeight, setBirthWeight] = useState<number>(3.1);
  const [birthLength, setBirthLength] = useState<number>(49.0);
  const [headCircumferenceBirth, setHeadCircumferenceBirth] = useState<number>(33.5);
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentNik, setParentNik] = useState('');
  const [address, setAddress] = useState('Jl. Melati RT 04 / RW 02, Kel. Dempo');
  const [rt, setRt] = useState('004');
  const [rw, setRw] = useState('002');
  const [hasKiaBook, setHasKiaBook] = useState(true);
  const [bpjsNumber, setBpjsNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = [
      'from-emerald-500 to-teal-600',
      'from-rose-500 to-pink-600',
      'from-blue-500 to-indigo-600',
      'from-amber-500 to-orange-600',
      'from-purple-500 to-violet-600',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newChild: ChildProfile = {
      id: `ch-${Date.now()}`,
      nik: nik || `317104${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name,
      birthDate,
      gender,
      birthWeight,
      birthLength,
      headCircumferenceBirth,
      parentName: parentName || 'Ibu ' + name.split(' ')[0],
      parentPhone: parentPhone || '081234567890',
      parentNik: parentNik || '3171045209950001',
      address,
      rt,
      rw,
      posyanduId: 'pos-01',
      posyanduName: 'Posyandu Melati A1',
      hasKiaBook,
      bpjsNumber: bpjsNumber || '000' + Math.floor(1000000000 + Math.random() * 9000000000),
      avatarColor: randomColor,
    };

    onRegisterChild(newChild);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Langkah 1 Posyandu • Pendaftaran Sasaran
          </span>
          <h3 className="font-extrabold text-slate-900 text-lg mt-1">
            Pendaftaran Balita Baru ke Posyandu
          </h3>
          <p className="text-xs text-slate-500">
            Formulir registrasi balita baru ke dalam database pemantauan antropometri wilayah kerja.
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
        {/* Identitas Balita */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Baby className="w-4 h-4" />
            <span>Identitas Anak & Riwayat Kelahiran</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Balita *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Muhammad Haidar"
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIK Anak (16 Digit) *
              </label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="317104xxxxxxxxxx"
                maxLength={16}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Lahir *
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenis Kelamin *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="L">Laki-laki (KMS Biru)</option>
                <option value="P">Perempuan (KMS Merah Muda)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Berat Lahir (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={birthWeight}
                onChange={(e) => setBirthWeight(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">BBLR: &lt; 2.5 kg</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Panjang Lahir (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={birthLength}
                onChange={(e) => setBirthLength(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lingkar Kepala Lahir (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={headCircumferenceBirth}
                onChange={(e) => setHeadCircumferenceBirth(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Data Orang Tua & Kontak */}
        <div className="space-y-4 pt-3 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Phone className="w-4 h-4" />
            <span>Data Orang Tua & Komunikasi</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Ibu / Ayah Kandung *
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Contoh: Ibu Siti Fatimah"
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp Aktif *
              </label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
                required
              />
              <span className="text-[10px] text-slate-400 block mt-1">Digunakan untuk pengingat jadwal penimbangan</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Domisili Lengkap
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RT</label>
                <input
                  type="text"
                  value={rt}
                  onChange={(e) => setRt(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RW</label>
                <input
                  type="text"
                  value={rw}
                  onChange={(e) => setRw(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl text-center font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs block">Sudah Memiliki Buku KIA?</span>
                <span className="text-[11px] text-slate-500">Buku cetak fisik KIA Kemenkes RI</span>
              </div>
              <input
                type="checkbox"
                checked={hasKiaBook}
                onChange={(e) => setHasKiaBook(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Kartu BPJS / JKN (Opsional)
              </label>
              <input
                type="text"
                value={bpjsNumber}
                onChange={(e) => setBpjsNumber(e.target.value)}
                placeholder="0001239847123"
                className="w-full text-xs p-3 border border-slate-200 rounded-xl font-mono"
              />
            </div>
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
            <span>Simpan Balita ke Posyandu</span>
          </button>
        </div>
      </form>
    </div>
  );
};
