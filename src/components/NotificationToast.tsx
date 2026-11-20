import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastState {
  show: boolean;
  message: string;
  type?: 'success' | 'warning' | 'info';
}

interface NotificationToastProps {
  toast: ToastState;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toast, onClose }) => {
  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
      <p className="flex-1 leading-relaxed text-slate-100">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
