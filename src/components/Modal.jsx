import React from 'react';

/**
 * Generic Modal component with accessibility features
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal should close
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.ariaLabelledBy - ID of element that labels the modal
 * @returns {React.ReactElement|null}
 */
export default function Modal({ open, onClose, children, ariaLabelledBy = "modal-title" }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "#0f172aCC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 50,
        overflow: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(960px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 32px)",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 10px 40px rgba(2,6,23,0.35)",
          padding: "20px",
          overflow: "auto",
          margin: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}