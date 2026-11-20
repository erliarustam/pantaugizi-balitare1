import React, { useState, useEffect, useCallback } from 'react';
import { AuthUser, CaptchaChallenge } from '../../types';
import { authApi, setStoredToken } from '../../services/api';
import {
  Phone,
  Lock,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  UserPlus,
  Baby,
  Stethoscope,
  AlertCircle,
  ArrowRight,
  KeyRound,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

type AuthMode = 'PARENT_LOGIN' | 'PARENT_REGISTER' | 'ADMIN_LOGIN';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('PARENT_LOGIN');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Captcha states
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadCaptcha = useCallback(async () => {
    setLoadingCaptcha(true);
    setCaptchaInput('');
    try {
      const challenge = await authApi.getCaptcha();
      setCaptcha(challenge);
    } catch {
      setErrorMsg('Gagal memuat tantangan Captcha dari server.');
    } finally {
      setLoadingCaptcha(false);
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha, mode]);

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMsg('');
    setPassword('');
    setCaptchaInput('');
  };

  // Validasi klien ringan sebelum kirim ke server
  const isPasswordValidAlphanumeric = /^[a-zA-Z0-9]*$/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!captcha) {
      setErrorMsg('Captcha belum siap. Silakan muat ulang.');
      return;
    }

    if (!captchaInput.trim()) {
      setErrorMsg('Harap masukkan kode konfirmasi Captcha terlebih dahulu.');
      return;
    }

    if (mode === 'ADMIN_LOGIN') {
      if (!/^[a-zA-Z0-9]{6,32}$/.test(password)) {
        setErrorMsg('Kata sandi Admin harus berupa huruf dan angka biasa (minimal 6 karakter, tanpa simbol/spasi).');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'PARENT_LOGIN') {
        const res = await authApi.loginParent({
          phone,
          captchaId: captcha.captchaId,
          captchaInput,
        });
        setStoredToken(res.token);
        onLoginSuccess(res.user);
      } else if (mode === 'PARENT_REGISTER') {
        const res = await authApi.registerParent({
          name,
          phone,
          captchaId: captcha.captchaId,
          captchaInput,
        });
        setStoredToken(res.token);
        onLoginSuccess(res.user);
      } else {
        const res = await authApi.loginAdmin({
          phone,
          password,
          captchaId: captcha.captchaId,
          captchaInput,
        });
        setStoredToken(res.token);
        onLoginSuccess(res.user);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk ke sistem.';
      setErrorMsg(msg);
      loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Standard Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-[11px] font-medium px-4 py-2 text-center flex items-center justify-center gap-2 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
        <span className="font-bold tracking-wide">
          PORTAL TEROTENTIKASI • PANTAU GIZI BALITA (WHO 2006 &amp; PERMENKES RI NO. 2/2020)
        </span>
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Hero / Branding Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-7 sm:p-8 flex flex-col justify-center shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-extrabold text-xl shadow-lg">
                  PG
                </div>
                <div>
                  <h1 className="font-extrabold text-xl tracking-tight">PantauGizi Balita</h1>
                  <p className="text-xs text-emerald-200">Posyandu Melati A1 • Sistem Terpadu</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <h2 className="text-2xl font-extrabold leading-snug">
                  Akses Aman Data Pertumbuhan &amp; KMS Digital Anak
                </h2>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Masuk menggunakan Nomor HP terdaftar dengan konfirmasi Captcha untuk Orang Tua, atau gunakan akun Admin Posyandu untuk pencatatan antropometri kader.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-start gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/10">
                  <Baby className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Portal Orang Tua</strong>
                    <span className="text-emerald-100/80">
                      Login praktis pakai No. HP + konfirmasi Captcha. Data anak terjaga sesuai nomor HP wali.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/10">
                  <Stethoscope className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Portal Admin / Kader Posyandu</strong>
                    <span className="text-emerald-100/80">
                      Login dengan No. HP Admin, Kata Sandi huruf &amp; angka biasa, serta verifikasi Captcha.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 flex flex-col justify-center">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold mb-6">
              <button
                type="button"
                onClick={() => handleModeChange('PARENT_LOGIN')}
                className={`py-2.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'PARENT_LOGIN'
                    ? 'bg-white text-emerald-800 shadow-sm ring-1 ring-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Baby className="w-4 h-4 shrink-0" />
                <span>Masuk Orang Tua</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('PARENT_REGISTER')}
                className={`py-2.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'PARENT_REGISTER'
                    ? 'bg-white text-emerald-800 shadow-sm ring-1 ring-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span>Daftar Orang Tua</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('ADMIN_LOGIN')}
                className={`py-2.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'ADMIN_LOGIN'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>Login Admin</span>
              </button>
            </div>

            {/* Form Title */}
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-slate-900">
                {mode === 'PARENT_LOGIN' && 'Masuk Portal Orang Tua'}
                {mode === 'PARENT_REGISTER' && 'Pendaftaran Akun Orang Tua Baru'}
                {mode === 'ADMIN_LOGIN' && 'Masuk Admin / Kader Posyandu'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'PARENT_LOGIN' &&
                  'Masukkan Nomor HP yang terdaftar di Posyandu lalu selesaikan verifikasi Captcha di bawah ini.'}
                {mode === 'PARENT_REGISTER' &&
                  'Daftarkan Nomor HP aktif Anda dengan verifikasi Captcha untuk memantau KMS digital anak.'}
                {mode === 'ADMIN_LOGIN' &&
                  'Gunakan Nomor HP Admin, kata sandi huruf dan angka biasa, serta konfirmasi Captcha keamanan.'}
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Lengkap (khusus Daftar Orang Tua) */}
              {mode === 'PARENT_REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap Orang Tua / Wali *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Ibu Dewi Kartika"
                    className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
                    required
                  />
                </div>
              )}

              {/* Input Nomor HP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {mode === 'ADMIN_LOGIN' ? 'Nomor HP Admin Posyandu *' : 'Nomor HP (WhatsApp Terdaftar) *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full text-sm pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono font-semibold"
                    required
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Format Indonesia awalan 08... atau +628...
                </span>
              </div>

              {/* Input Sandi Admin (Huruf dan Angka Biasa) */}
              {mode === 'ADMIN_LOGIN' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Kata Sandi Admin (Huruf &amp; Angka Biasa) *
                    </label>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Alfanumerik (a-z, A-Z, 0-9)
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan sandi huruf & angka (min. 6 karakter)"
                      className={`w-full text-sm pl-11 pr-11 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white font-mono ${
                        password && !isPasswordValidAlphanumeric
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-slate-200 focus:ring-emerald-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && !isPasswordValidAlphanumeric ? (
                    <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                      Sandi hanya boleh berisi huruf dan angka biasa (tanpa spasi atau tanda baca).
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Contoh format yang valid: Melati123, posyandu99
                    </span>
                  )}
                </div>
              )}

              {/* Konfirmasi Captcha Server-Side */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Konfirmasi Keamanan Captcha *</span>
                  </label>
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    disabled={loadingCaptcha}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingCaptcha ? 'animate-spin' : ''}`} />
                    <span>Muat Ulang</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div
                    className="bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0 min-h-[72px] min-w-[228px] select-none shadow-2xs"
                    aria-label="Gambar Captcha"
                  >
                    {captcha ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: captcha.svg }}
                        className="leading-none"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">Memuat Captcha...</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                      placeholder="Ketik 5 karakter di gambar"
                      maxLength={5}
                      autoComplete="off"
                      className="w-full text-base tracking-[0.25em] uppercase text-center font-mono font-extrabold px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <span className="text-[10px] text-slate-500 block text-center sm:text-left">
                      Masukkan huruf &amp; angka sesuai gambar di samping
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                  mode === 'ADMIN_LOGIN'
                    ? 'bg-slate-900 hover:bg-slate-800'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                {isSubmitting ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'PARENT_LOGIN' && 'Masuk dengan Nomor HP'}
                      {mode === 'PARENT_REGISTER' && 'Daftar & Masuk Sekarang'}
                      {mode === 'ADMIN_LOGIN' && 'Masuk sebagai Admin Posyandu'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        PantauGizi Balita • Autentikasi Nomor HP &amp; Verifikasi Captcha Server-Side
      </footer>
    </div>
  );
};
