import React from 'react';
import Modal from './Modal.jsx';
import Badge from './Badge.jsx';
import { computePrice, scoreColor } from '../utils/pricing.js';

/**
 * LeadModal component for displaying detailed lead information
 * @param {Object} props
 * @param {Object|null} props.lead - Lead data object to display, null to close modal
 * @param {Function} props.onClose - Function to call when modal should close
 * @returns {React.ReactElement}
 */
export default function LeadModal({ lead, onClose }) {
  const handleBuyClick = (e) => {
    if (!lead?.stripeCheckoutUrl || lead.stripeCheckoutUrl === "#") {
      e.preventDefault();
      alert("Connect this lead to a Stripe Checkout URL in the data (stripeCheckoutUrl).\nFor now this is a demo.");
    }
  };

  return (
    <Modal open={!!lead} onClose={onClose}>
      {lead && (
        <div style={{ display: "grid", gap: 16 }}>
          {/* Header with close button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div id="modal-title" style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{lead.Company}</div>
              <div style={{ color: "#6b7280", fontSize: 16 }}>{lead.Name} — {lead.Role}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Badge color={scoreColor(Number(lead.Score))}>Score {lead.Score}</Badge>
              <button
                onClick={onClose}
                style={{
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#6b7280",
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Content grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, color: "#111827" }}>{lead.Brief || "High‑intent signals detected."}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(lead["Tech Signals"] || "").split(";").filter(t => t.trim()).map((t, idx) => (
                  <Badge key={`modal-${t.trim()}-${idx}`} color="#334155">{t.trim()}</Badge>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 14 }}>
                <strong>Location:</strong> {lead.Location || "—"}
              </div>
              <div style={{ fontSize: 14 }}>
                <strong>Industry:</strong> {lead.Industry || "—"}
              </div>
              <div style={{ fontSize: 14 }}>
                <strong>Verification:</strong> {lead["Verification Status"] || "—"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, marginBottom: 6 }}><strong>Sources</strong></div>
              <ul style={{ listStyle: "disc", paddingLeft: 18, display: "grid", gap: 6 }}>
                {(lead["Source URLs"]||"").split(";").map((u, i) => (
                  <li key={i}>
                    <a href={u.trim()} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
                      {u.trim()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 22 }}>
              ${computePrice(lead["Base Price"], lead.Score, lead.Exclusivity)}
            </div>
            <a
              href={lead.stripeCheckoutUrl || "#"}
              onClick={handleBuyClick}
              style={{
                background: "#111827",
                color: "white",
                padding: "10px 14px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Buy lead
            </a>
            <a href={lead.Website} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>Visit site</a>
          </div>
        </div>
      )}
    </Modal>
  );
}