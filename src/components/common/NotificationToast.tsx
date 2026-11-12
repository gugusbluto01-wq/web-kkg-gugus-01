import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  subtitle?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-white border border-stone-200 rounded-xl shadow-lg transition-all transform duration-200 animate-in fade-in slide-in-from-bottom-2"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{toast.message}</p>
            {toast.subtitle && <p className="text-xs text-slate-500 mt-0.5">{toast.subtitle}</p>}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
