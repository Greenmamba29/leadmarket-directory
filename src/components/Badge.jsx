import React from 'react';

/**
 * Badge component for displaying labels with color coding
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display in the badge
 * @param {string} props.color - Color for the badge (hex color)
 * @returns {React.ReactElement}
 */
export default function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 9999,
        fontSize: 12,
        padding: "4px 10px",
        background: `${color}22`,
        color: color || "#111827",
        border: `1px solid ${color || "#e5e7eb"}`,
      }}
    >
      {children}
    </span>
  );
}