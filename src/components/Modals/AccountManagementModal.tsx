import React, { useState, useEffect } from 'react';
import { AuthUser } from '../../types';
import { authApi } from '../../services/api';
import { X, KeyRound, UserPlus, Users, Check, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';

interface AccountManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onTriggerNotification: (msg: string) => void;
}

export const AccountManagementModal: React.FC<AccountManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTriggerNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'password'>('users');
  const [usersList, setUsersList] = useState<AuthUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Add user state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'KADER' | 'PARENT'>('KADER');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passError, setPassError] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await authApi.getUsers();
      setUsersList(res.users);
    } catch {
      // ignore silently if unauthorized
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser.role === 'KADER') {
      loadUsers();
    }
  }, [isOpen, currentUser.role]);

  if (!isOpen) return null;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');

    if (newRole === 'KADER' && !/^[a-zA-Z0-9]{6,32}$/.test(newUserPassword)) {
      setUserError('Kata sandi Admin harus memakai huruf dan angka biasa (6-32 karakter, tanpa simbol/spasi).');
      return;
    }

    setCreatingUser(true);
    try {
      const res = await authApi.createUser({
        name: newName,
        phone: newPhone,
        role: newRole,
        password: newRole === 'KADER' ? newUserPassword : undefined,
      });
      setUsersList((prev) => [...prev, res.user]);
      setNewName('');
      setNewPhone('');
      setNewUserPassword('');
      onTriggerNotification(`Akun ${res.user.role === 'KADER' ? 'Admin' : 'Orang Tua'} (${res.user.phone}) berhasil dibuat.`);
    } catch (err) {
      setUserError(err instanceof Error ? err.message : 'Gagal membuat akun pengguna.');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (!/^[a-zA-Z0-9]{6,32}$/.test(newPassword)) {
      setPassError('Kata sandi baru wajib memakai huruf dan angka biasa (6-32 karakter, tanpa simbol/spasi).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setChangingPass(true);
    try {
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onTriggerNotification(res.message);
      onClose();
    } catch (err) {
      setPassError(err instanceof Error ? err.message : 'Gagal mengubah kata sandi.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base">Manajemen Akun &amp; Keamanan Sandi</h3>
              <p className="text-[11px] text-slate-300">
                Login aktif: {currentUser.name} ({currentUser.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-2 bg-slate-50">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar &amp; Tambah Akun ({usersList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'password'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Ubah Sandi Admin Saya</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-xs">
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Form Tambah Pengguna Baru */}
              <form onSubmit={handleCreateUser} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-emerald-700" />
                  <span>Tambah Akun Admin atau Orang Tua</span>
                </h4>

                {userError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{userError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Contoh: Ibu Ani (Kader)"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nomor HP *</label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Peran Akun *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as 'KADER' | 'PARENT')}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="KADER">Admin / Kader Posyandu (Pakai Sandi)</option>
                      <option value="PARENT">Orang Tua Balita (Tanpa Sandi, No HP + Captcha)</option>
                    </select>
                  </div>

                  {newRole === 'KADER' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Sandi Admin (Huruf &amp; Angka Biasa) *
                      </label>
                      <input
                        type="text"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Min. 6 huruf/angka (misal: Posyandu26)"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={creatingUser}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {creatingUser ? 'Menyimpan...' : '+ Tambah Akun'}
                  </button>
                </div>
              </form>

              {/* Tabel Pengguna Terdaftar */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Akun Terdaftar di Sistem
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Nama</th>
                        <th className="p-3">Nomor HP</th>
                        <th className="p-3">Peran</th>
                        <th className="p-3">Metode Login</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            Memuat daftar pengguna...
                          </td>
                        </tr>
                      ) : (
                        usersList.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{u.name}</td>
                            <td className="p-3 font-mono text-slate-700">{u.phone}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  u.role === 'KADER'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {u.role === 'KADER' ? 'Admin Posyandu' : 'Orang Tua'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500">
                              {u.role === 'KADER' ? 'No HP + Sandi + Captcha' : 'No HP + Captcha'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md mx-auto">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <strong className="block mb-0.5">Aturan Kata Sandi Admin:</strong>
                <span>Gunakan kombinasi huruf dan angka biasa (6–32 karakter), tanpa spasi atau simbol khusus.</span>
              </div>

              {passError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi Saat Ini *</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => !p)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi Baru (Huruf &amp; Angka Biasa) *</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Contoh: Melati2026"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru *</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{changingPass ? 'Menyimpan...' : 'Simpan Sandi Baru'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
