import React from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  onViewCart?: () => void;
}

export const NotificationToast: React.FC<ToastProps> = ({ message, onClose, onViewCart }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 max-w-md">
      <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-1 text-xs font-semibold text-neutral-100">
        {message}
      </div>
      {onViewCart && (
        <button
          onClick={() => {
            onViewCart();
            onClose();
          }}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 underline px-1"
        >
          Savatga o'tish
        </button>
      )}
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-white p-1 rounded-lg"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
