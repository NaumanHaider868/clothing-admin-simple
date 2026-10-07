export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", busy, onConfirm, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-[monospace] mb-2">{title}</h2>
        <p className="text-sm font-[monospace] mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
