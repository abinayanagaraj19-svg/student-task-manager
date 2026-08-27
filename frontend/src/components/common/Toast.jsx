import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const Toast = () => {
  const { toast, hideToast } = useTasks();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, hideToast]);

  if (!toast.visible) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
          isSuccess
            ? 'bg-emerald-900/90 text-white border-emerald-700'
            : isError
            ? 'bg-rose-900/90 text-white border-rose-700'
            : 'bg-slate-900/90 text-white border-slate-700'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400 shrink-0" />}

        <span className="pr-2">{toast.message}</span>

        <button
          onClick={hideToast}
          className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
