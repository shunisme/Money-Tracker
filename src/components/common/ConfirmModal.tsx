import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { DeleteAnimation } from './DeleteAnimation';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  deletedMessage?: string;
  itemDetails?: {
    title?: string;
    badge?: string;
  };
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  deletedMessage,
  itemDetails,
}) => {
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsDeleted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (isDestructive) {
      setIsDeleted(true);
      onConfirm();
      setTimeout(() => {
        setIsDeleted(false);
        onClose();
      }, 950);
    } else {
      onConfirm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {isDeleted ? (
        <div
          className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col items-center justify-center p-8 sm:p-10 text-center animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="my-2">
            <DeleteAnimation size={72} strokeWidth={3.5} />
          </div>

          <div className="mt-3">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {deletedMessage || 'Transaction Deleted'}
            </h3>
            {itemDetails?.title && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px] truncate mx-auto font-medium">
                {itemDetails.title}
              </p>
            )}
          </div>

          {itemDetails?.badge && (
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-bold text-rose-600 dark:text-rose-400 shadow-xs">
              <span>{itemDetails.badge}</span>
            </div>
          )}
        </div>
      ) : (
        <div
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full flex-shrink-0 ${
                isDestructive
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                  : 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirmClick}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-colors ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-rose-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-500/20'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
