import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  isLoading = false,
  confirmLabel = "Delete",
  confirmDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: "rgba(9,30,66,0.54)" }}
    >
      <div
        className="w-full max-w-[400px] rounded shadow-2xl fade-in"
        style={{ background: "#fff", border: "1px solid #dfe1e6" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #dfe1e6" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0"
              style={{ background: confirmDanger ? "#ffebe6" : "#e8f0fe" }}
            >
              <AlertTriangle
                size={14}
                style={{ color: confirmDanger ? "#de350b" : "#0052cc" }}
              />
            </div>
            <h3 className="text-sm font-bold" style={{ color: "#172b4d" }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded transition-all"
            style={{ color: "#6b778c" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f7"; e.currentTarget.style.color = "#172b4d"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#6b778c"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm" style={{ color: "#6b778c" }}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-2 px-5 py-3"
          style={{ borderTop: "1px solid #dfe1e6" }}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 rounded text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: "#f4f5f7", color: "#172b4d", border: "1px solid #dfe1e6" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ebecf0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#f4f5f7"; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: confirmDanger ? "#de350b" : "#0052cc" }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.background = confirmDanger ? "#bf2600" : "#0065ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = confirmDanger ? "#de350b" : "#0052cc";
            }}
          >
            {isLoading && <Loader2 size={13} className="animate-spin" />}
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
