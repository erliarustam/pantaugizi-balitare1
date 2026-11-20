import type {
  AuthUser,
  CaptchaChallenge,
  ChildProfile,
  MeasurementRecord,
  ImmunizationItem,
  MilestoneItem,
  PosyanduSchedule,
  NutritionCase,
} from '../types';

const TOKEN_STORAGE_KEY = 'pantaugizi_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Permintaan gagal (${res.status})`);
  }
  return data as T;
}

export interface AppDataPayload {
  children: ChildProfile[];
  measurements: MeasurementRecord[];
  immunizations: ImmunizationItem[];
  milestones: MilestoneItem[];
  schedules: PosyanduSchedule[];
  cases: NutritionCase[];
}

export const authApi = {
  getCaptcha: () => apiFetch<CaptchaChallenge>('/api/auth/captcha'),

  loginParent: (payload: { phone: string; captchaId: string; captchaInput: string }) =>
    apiFetch<{ token: string; user: AuthUser }>('/api/auth/login-parent', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  registerParent: (payload: { name: string; phone: string; captchaId: string; captchaInput: string }) =>
    apiFetch<{ token: string; user: AuthUser }>('/api/auth/register-parent', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  loginAdmin: (payload: { phone: string; password: string; captchaId: string; captchaInput: string }) =>
    apiFetch<{ token: string; user: AuthUser }>('/api/auth/login-admin', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => apiFetch<{ user: AuthUser }>('/api/auth/me'),

  logout: () =>
    apiFetch<{ ok: boolean }>('/api/auth/logout', {
      method: 'POST',
    }),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ ok: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getUsers: () => apiFetch<{ users: AuthUser[] }>('/api/admin/users'),

  createUser: (payload: { name: string; phone: string; role: 'PARENT' | 'KADER'; password?: string }) =>
    apiFetch<{ user: AuthUser }>('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const dataApi = {
  getAppData: () => apiFetch<AppDataPayload>('/api/app-data'),

  createChild: (child: ChildProfile) =>
    apiFetch<{ child: ChildProfile }>('/api/children', {
      method: 'POST',
      body: JSON.stringify(child),
    }),

  createMeasurement: (record: MeasurementRecord) =>
    apiFetch<{ measurement: MeasurementRecord; createdCase: NutritionCase | null }>('/api/measurements', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  updateCaseStatus: (caseId: string, status: NutritionCase['status']) =>
    apiFetch<{ nutritionCase: NutritionCase }>(`/api/cases/${caseId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  toggleMilestone: (milestoneId: string) =>
    apiFetch<{ milestone: MilestoneItem }>(`/api/milestones/${milestoneId}`, {
      method: 'PATCH',
    }),

  confirmImmunization: (immunizationId: string) =>
    apiFetch<{ immunization: ImmunizationItem }>(`/api/immunizations/${immunizationId}`, {
      method: 'PATCH',
    }),

  toggleScheduleRsvp: (scheduleId: string) =>
    apiFetch<{ schedule: PosyanduSchedule }>(`/api/schedules/${scheduleId}`, {
      method: 'PATCH',
    }),
};
