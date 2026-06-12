import { Loader2 } from "lucide-react";

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-[16px] w-full max-w-[400px] shadow-2xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-[16px] font-bold text-ad-dark">{title}</h3>
          <p className="text-[13px] text-ad-gray mt-1">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="border border-ad-border text-ad-gray text-[14px] rounded-[8px] px-5 h-10 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 text-white text-[14px] font-medium rounded-[8px] px-5 h-10 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
