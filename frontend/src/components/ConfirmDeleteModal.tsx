import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  title = "Confirm Deletion",
  message,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-0">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-[var(--neutral-500)]"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-[var(--danger-600)] text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
