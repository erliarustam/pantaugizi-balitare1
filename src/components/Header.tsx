import React from 'react';
import { AuthUser } from '../types';
import { HelpCircle, LogOut, Shield, Phone, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentUser: AuthUser;
  onLogout: () => void;
  onOpenGuide: () => void;
  onOpenAccountModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenGuide,
  onOpenAccountModal,
}) => {
  const isAdmin = currentUser.role === 'KADER';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Status Referensi Standar WHO */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-[11px] font-medium px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 max-w-6xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span className="font-bold tracking-wide">
              STANDAR BAKU: WHO Child Growth Standards 2006 &amp; Permenkes RI No. 2/2020
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              e-PPGBM Compatible
            </span>
            <button
              onClick={onOpenGuide}
              className="hover:underline flex items-center gap-1 text-[11px] font-medium text-emerald-100 hover:text-white cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Panduan Pengukuran</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20">
              PG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  PantauGizi Balita
                </h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px] uppercase tracking-wider">
                  {currentUser.posyanduName}
                </span>
              </div>
              <p className="text-xs text-slate-500">Sistem Antropometri &amp; Intervensi Stunting Terpadu</p>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={onOpenGuide}
              className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-xl"
              title="Panduan"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Authenticated User Profile & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                isAdmin ? 'bg-slate-900' : 'bg-emerald-700'
              }`}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{currentUser.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    isAdmin
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isAdmin ? 'Admin Posyandu' : 'Orang Tua'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" />
                <span>{currentUser.phone}</span>
                <UserCheck className="w-3 h-3 text-emerald-600 ml-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={onOpenAccountModal}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>Kelola Akun &amp; Sandi</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
