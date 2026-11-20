/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import type {
  AuthUser,
  ChildProfile,
  MeasurementRecord,
  ImmunizationItem,
  MilestoneItem,
  PosyanduSchedule,
  NutritionCase,
} from './types';
import { authApi, dataApi, getStoredToken, setStoredToken } from './services/api';

// Auth & Layout Components
import { LoginPage } from './components/Auth/LoginPage';
import { Header } from './components/Header';
import { NotificationToast, ToastState } from './components/NotificationToast';

// Parent View Components
import { ParentOverview } from './components/ParentView/ParentOverview';
import { ParentKmsChart } from './components/ParentView/ParentKmsChart';
import { ParentImmunizationMilestones } from './components/ParentView/ParentImmunizationMilestones';
import { ParentNutritionAdvice } from './components/ParentView/ParentNutritionAdvice';
import { KmsModalDocument } from './components/ParentView/KmsModalDocument';

// Kader (Admin Posyandu) View Components
import { KaderDashboard } from './components/KaderView/KaderDashboard';
import { KaderMeasurementForm } from './components/KaderView/KaderMeasurementForm';
import { KaderChildRegistration } from './components/KaderView/KaderChildRegistration';
import { KaderCaseManagement } from './components/KaderView/KaderCaseManagement';

// Modals
import { WhatsAppModal } from './components/Modals/WhatsAppModal';
import { MeasurementGuideModal } from './components/Modals/MeasurementGuideModal';
import { AccountManagementModal } from './components/Modals/AccountManagementModal';

// Icons for Sub-navs
import {
  FileText,
  LineChart,
  ShieldCheck,
  Utensils,
  LayoutDashboard,
  Scale,
  UserPlus,
  AlertTriangle,
  Baby,
  Loader2,
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Navigation State
  const [parentTab, setParentTab] = useState<'overview' | 'chart' | 'milestone' | 'advice'>('overview');
  const [kaderTab, setKaderTab] = useState<'dashboard' | 'measure' | 'register' | 'cases'>('dashboard');

  // Application Data State (loaded from persistent server API)
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([]);
  const [immunizations, setImmunizations] = useState<ImmunizationItem[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [schedules, setSchedules] = useState<PosyanduSchedule[]>([]);
  const [cases, setCases] = useState<NutritionCase[]>([]);

  // Modals & Popups
  const [isKmsModalOpen, setIsKmsModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedCaseForWa, setSelectedCaseForWa] = useState<NutritionCase | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Notification Toast State
  const [toast, setToast] = useState<ToastState>({ show: false, message: '' });

  const triggerToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  const loadAppData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const payload = await dataApi.getAppData();
      setChildrenList(payload.children);
      setMeasurements(payload.measurements);
      setImmunizations(payload.immunizations);
      setMilestones(payload.milestones);
      setSchedules(payload.schedules);
      setCases(payload.cases);

      if (payload.children.length > 0) {
        setSelectedChildId((prev) =>
          payload.children.some((c) => c.id === prev) ? prev : payload.children[0].id
        );
      } else {
        setSelectedChildId('');
      }
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Gagal memuat data aplikasi.', 'warning');
    } finally {
      setIsLoadingData(false);
    }
  }, [triggerToast]);

  // Verify existing token on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        setAuthUser(res.user);
      } catch {
        setStoredToken(null);
        setAuthUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    verifySession();
  }, []);

  // Load app data whenever authUser changes
  useEffect(() => {
    if (authUser) {
      loadAppData();
    }
  }, [authUser, loadAppData]);

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    setParentTab('overview');
    setKaderTab('dashboard');
    triggerToast(`Selamat datang, ${user.name}!`);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // tetap hapus token lokal
    }
    setStoredToken(null);
    setAuthUser(null);
    setChildrenList([]);
    setMeasurements([]);
    setCases([]);
  };

  // Show loading screen while checking existing session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-600">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
        <p className="text-xs font-semibold">Memeriksa sesi login PantauGizi Balita...</p>
      </div>
    );
  }

  // Show Login Page if unauthenticated
  if (!authUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Selected Child helpers
  const selectedChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];
  const childMeasurements = selectedChild
    ? measurements.filter((m) => m.childId === selectedChild.id)
    : [];
  const latestMeasurement = [...childMeasurements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  // Handler: Tambah Pengukuran Baru dari Admin/Kader
  const handleSaveMeasurement = async (record: MeasurementRecord) => {
    try {
      const res = await dataApi.createMeasurement(record);
      setMeasurements((prev) => [res.measurement, ...prev]);
      if (res.createdCase) {
        setCases((prev) => [res.createdCase!, ...prev]);
      }
      setKaderTab('dashboard');
      triggerToast(`Pengukuran untuk ${selectedChild?.name || 'balita'} berhasil disimpan ke database!`);
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Gagal menyimpan pengukuran.', 'warning');
    }
  };

  // Handler: Pendaftaran Balita Baru
  const handleRegisterChild = async (newChild: ChildProfile) => {
    try {
      const res = await dataApi.createChild(newChild);
      setChildrenList((prev) => [res.child, ...prev]);
      setSelectedChildId(res.child.id);
      setKaderTab('dashboard');
      triggerToast(`Balita ${res.child.name} berhasil didaftarkan ke Posyandu & akun Orang Tua disinkronkan!`);
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Gagal mendaftarkan balita.', 'warning');
    }
  };

  // Handler: Status Kasus Gizi
  const handleUpdateCaseStatus = async (caseId: string, newStatus: NutritionCase['status']) => {
    try {
      const res = await dataApi.updateCaseStatus(caseId, newStatus);
      setCases((prev) => prev.map((c) => (c.id === caseId ? res.nutritionCase : c)));
      triggerToast(`Status intervensi kasus berhasil diperbarui menjadi: ${newStatus}`);
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Gagal memperbarui status kasus.', 'warning');
    }
  };

  // Handler: Milestone Checklist
  const handleToggleMilestone = async (milestoneId: string) => {
    try {
      const res = await dataApi.toggleMilestone(milestoneId);
      setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? res.milestone : m)));
      triggerToast('Pencapaian milestone perkembangan berhasil diperbarui.');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Gagal memperbarui milestone.', 'warning');
    }
  };

  // Handler: Konfirmasi Vaksin Imunisasi
  const handleUpdateImmunization = async (immunizationId: string) => {
    try {
      const res = await dataApi.confirmImmunization(immunizationId);
      setImmunizations((prev) => prev.map((i) => (i.id === immunizationId ? res.immunization : i)));
      triggerToast('Jadwal imunisasi berhasil ditandai sebagai Selesai / Terverifikasi.');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Gagal memperbarui imunisasi.', 'warning');
    }
  };

  // Handler: RSVP Posyandu
  const handleToggleRsvp = async (scheduleId: string) => {
    try {
      const res = await dataApi.toggleScheduleRsvp(scheduleId);
      setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? res.schedule : s)));
      triggerToast('Status konfirmasi kehadiran Posyandu berhasil diperbarui.');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Gagal memperbarui kehadiran.', 'warning');
    }
  };

  // Handler: WhatsApp Modal
  const handleOpenWhatsAppModal = (c: NutritionCase) => {
    setSelectedCaseForWa(c);
    setIsWhatsAppModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header Terotentikasi */}
      <Header
        currentUser={authUser}
        onLogout={handleLogout}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-grow w-full space-y-6">
        {isLoadingData ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-7 h-7 text-emerald-700 animate-spin" />
            <span className="text-xs font-semibold">Memuat data antropometri terpadu...</span>
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* 1. PORTAL ORANG TUA (PARENT VIEW) */}
            {/* ========================================================= */}
            {authUser.role === 'PARENT' && (
              <div className="space-y-6">
                {childrenList.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <Baby className="w-7 h-7" />
                    </div>
                    <h2 className="font-extrabold text-slate-900 text-lg">
                      Belum Ada Data Balita Terhubung
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Akun Anda (<span className="font-mono font-bold">{authUser.phone}</span>) belum terhubung dengan data anak di Posyandu Melati A1. Silakan hubungi Kader/Admin Posyandu untuk mendaftarkan data balita Anda menggunakan nomor HP ini.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Sub-nav Tabs Orang Tua */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setParentTab('overview')}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            parentTab === 'overview'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Ringkasan &amp; KMS</span>
                        </button>
                        <button
                          onClick={() => setParentTab('chart')}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            parentTab === 'chart'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <LineChart className="w-4 h-4" />
                          <span>Kurva Pertumbuhan &amp; Z-Score</span>
                        </button>
                        <button
                          onClick={() => setParentTab('milestone')}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            parentTab === 'milestone'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Imunisasi &amp; Tumbuh Kembang</span>
                        </button>
                        <button
                          onClick={() => setParentTab('advice')}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            parentTab === 'advice'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <Utensils className="w-4 h-4" />
                          <span>Resep MPASI &amp; Protein Hewani</span>
                        </button>
                      </div>

                      {selectedChild && (
                        <div className="text-xs text-slate-500 font-medium px-3 hidden md:block">
                          Profil Aktif: <strong className="text-slate-800">{selectedChild.name}</strong>
                        </div>
                      )}
                    </div>

                    {/* Tab Views */}
                    {parentTab === 'overview' && selectedChild && (
                      <ParentOverview
                        childrenList={childrenList}
                        selectedChild={selectedChild}
                        onSelectChild={(child) => {
                          setSelectedChildId(child.id);
                          triggerToast(`Beralih data anak ke: ${child.name}`);
                        }}
                        latestMeasurement={latestMeasurement}
                        schedules={schedules}
                        onOpenKmsModal={() => setIsKmsModalOpen(true)}
                        onDownloadPdf={() => {
                          triggerToast('Mengunduh KMS Digital dalam format PDF resmi...');
                        }}
                        onSetReminder={(sch) => {
                          triggerToast(
                            `Pengingat WhatsApp berhasil disetel untuk penimbangan tanggal ${sch.date} di ${sch.posyanduName}.`
                          );
                        }}
                        onToggleRsvp={handleToggleRsvp}
                      />
                    )}

                    {parentTab === 'chart' && selectedChild && (
                      <ParentKmsChart child={selectedChild} measurements={childMeasurements} />
                    )}

                    {parentTab === 'milestone' && selectedChild && (
                      <ParentImmunizationMilestones
                        child={selectedChild}
                        immunizations={immunizations.filter((i) => i.childId === selectedChild.id)}
                        milestones={milestones.filter((m) => m.childId === selectedChild.id)}
                        onToggleMilestone={handleToggleMilestone}
                        onUpdateImmunization={handleUpdateImmunization}
                      />
                    )}

                    {parentTab === 'advice' && (
                      <ParentNutritionAdvice childAgeMonths={latestMeasurement?.ageMonths || 14} />
                    )}
                  </>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. PORTAL ADMIN / KADER POSYANDU */}
            {/* ========================================================= */}
            {authUser.role === 'KADER' && (
              <div className="space-y-6">
                {/* Sub-nav Tabs Kader */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setKaderTab('dashboard')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        kaderTab === 'dashboard'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dasbor &amp; Daftar Balita</span>
                    </button>
                    <button
                      onClick={() => setKaderTab('measure')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        kaderTab === 'measure'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Scale className="w-4 h-4" />
                      <span>+ Input Pengukuran</span>
                    </button>
                    <button
                      onClick={() => setKaderTab('register')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        kaderTab === 'register'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>+ Daftarkan Balita Baru</span>
                    </button>
                    <button
                      onClick={() => setKaderTab('cases')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        kaderTab === 'cases'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        Kasus 2T &amp; Rujukan ({cases.filter((c) => c.status !== 'TERSELESAIKAN').length})
                      </span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 font-medium px-3 hidden md:block">
                    Admin Bertugas: <strong className="text-slate-800">{authUser.name}</strong>
                  </div>
                </div>

                {/* Kader Tab Views */}
                {kaderTab === 'dashboard' && (
                  <KaderDashboard
                    childrenList={childrenList}
                    measurements={measurements}
                    onOpenMeasureForm={(childId) => {
                      if (childId) setSelectedChildId(childId);
                      setKaderTab('measure');
                    }}
                    onOpenRegisterForm={() => setKaderTab('register')}
                    onSelectChildForDetail={(child) => {
                      setSelectedChildId(child.id);
                      setIsKmsModalOpen(true);
                    }}
                    onOpenCaseModal={() => setKaderTab('cases')}
                  />
                )}

                {kaderTab === 'measure' && (
                  <KaderMeasurementForm
                    childrenList={childrenList}
                    initialChildId={selectedChildId}
                    previousMeasurements={measurements}
                    onSaveMeasurement={handleSaveMeasurement}
                    onCancel={() => setKaderTab('dashboard')}
                  />
                )}

                {kaderTab === 'register' && (
                  <KaderChildRegistration
                    onRegisterChild={handleRegisterChild}
                    onCancel={() => setKaderTab('dashboard')}
                  />
                )}

                {kaderTab === 'cases' && (
                  <KaderCaseManagement
                    cases={cases}
                    onUpdateCaseStatus={handleUpdateCaseStatus}
                    onOpenWhatsAppModal={handleOpenWhatsAppModal}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      {selectedChild && (
        <KmsModalDocument
          isOpen={isKmsModalOpen}
          onClose={() => setIsKmsModalOpen(false)}
          child={selectedChild}
          measurements={childMeasurements}
          onDownloadPdf={() => triggerToast('Dokumen KMS Digital PDF berhasil diunduh.')}
        />
      )}

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        targetCase={selectedCaseForWa}
        onSendMessage={(msg) => triggerToast(msg)}
      />

      <MeasurementGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {authUser.role === 'KADER' && (
        <AccountManagementModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          currentUser={authUser}
          onTriggerNotification={(msg) => triggerToast(msg)}
        />
      )}

      {/* Toast Notification */}
      <NotificationToast
        toast={toast}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>PantauGizi Balita • Standar Antropometri WHO 2006 &amp; Permenkes RI No. 2/2020</span>
          <span className="text-emerald-700 font-bold">Terhubung e-PPGBM &amp; Buku KIA Kemenkes</span>
        </div>
      </footer>
    </div>
  );
}
