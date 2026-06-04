import React, { useState, useEffect } from "react";
import { X, Trash2, Loader2 } from "lucide-react";
import ModalPortal from "@/components/ui/ModalPortal";

const DeleteProjectModal = ({ isOpen, onClose, projectName, onConfirm, isDeleting }) => {
  const [inputValue, setInputValue] = useState("");
  const CONFIRM_WORD = "DELETE";
  const isReady = inputValue === CONFIRM_WORD && !isDeleting;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (isOpen) setInputValue(""); }, [isOpen]);

  return (
    <ModalPortal isOpen={isOpen}>
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(9,30,66,0.6)" }}
      onClick={() => !isDeleting && onClose()}
    >
      <div
        className="w-full max-w-[440px] rounded-lg overflow-hidden fade-in"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--red-light)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(239,68,68,0.15)" }}
            >
              <Trash2 size={16} style={{ color: "var(--red-text)" }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--red-text)" }}>
                Delete project
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--red-text)", opacity: 0.75 }}>
                This action is permanent and cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded transition-all"
            style={{ color: "var(--red-text)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            You're about to permanently delete{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              "{projectName}"
            </span>
            . All tasks, comments, and data will be removed.
          </p>

          {/* Confirm box */}
          <div
            className="rounded-lg p-4 space-y-3"
            style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Type{" "}
              <span
                className="font-mono font-bold px-1.5 py-0.5 rounded"
                style={{ background: "var(--red-light)", color: "var(--red-text)" }}
              >
                {CONFIRM_WORD}
              </span>{" "}
              to confirm deletion
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              placeholder={`Type ${CONFIRM_WORD} here...`}
              autoFocus
              className="pm-input font-mono tracking-widest"
              style={{
                borderColor: inputValue === CONFIRM_WORD ? "var(--red)" : "var(--border)",
                boxShadow: inputValue === CONFIRM_WORD ? "0 0 0 2px rgba(239,68,68,0.15)" : "none",
              }}
            />
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-1 rounded-full overflow-hidden"
                style={{ background: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((inputValue.length / CONFIRM_WORD.length) * 100, 100)}%`,
                    background: inputValue === CONFIRM_WORD ? "var(--red)" : "var(--accent)",
                  }}
                />
              </div>
              <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                {inputValue.length}/{CONFIRM_WORD.length}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg-subtle)" }}
        >
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded text-sm font-medium transition-all disabled:opacity-50"
            style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-card)"; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isReady}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--red)" }}
            onMouseEnter={(e) => { if (isReady) e.currentTarget.style.background = "var(--red-text)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--red)"; }}
          >
            {isDeleting && <Loader2 size={14} className="animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};

export default DeleteProjectModal;
