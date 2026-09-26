"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity dark:bg-slate-950/80"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Card - Centered Layout */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-500/5 backdrop-blur-2xl text-center animate-in fade-in zoom-in-95 duration-150 sm:p-8 dark:border-slate-800/80 dark:bg-slate-900">
        {/* Centered Icon */}
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner ${
            isDanger
              ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
              : "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
          }`}
        >
          {isDanger ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Centered Headings */}
        <h3 className="mt-5 text-xl font-extrabold text-slate-900 tracking-tight dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto dark:text-slate-400">{message}</p>

        {/* Symmetrical Action Buttons Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white shadow-lg transition disabled:opacity-50 ${
              isDanger
                ? "bg-red-600 shadow-red-600/20 hover:bg-red-500"
                : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-500"
            }`}
          >
            {isLoading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}