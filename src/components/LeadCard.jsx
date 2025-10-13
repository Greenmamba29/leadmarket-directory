import React from 'react';
import Badge from './Badge.jsx';
import { computePrice, scoreColor } from '../utils/pricing.js';
import { maskEmail } from '../utils/formatting.js';

/**
 * LeadCard component for displaying individual lead information
 * @param {Object} props
 * @param {Object} props.lead - Lead data object
 * @param {Function} props.onPreview - Callback function when preview button is clicked
 * @returns {React.ReactElement}
 */
export default function LeadCard({ lead, onPreview }) {
  const price = computePrice(lead["Base Price"], lead.Score, lead.Exclusivity);

  const handleBuyClick = (e) => {
    if (!lead.stripeCheckoutUrl || lead.stripeCheckoutUrl === "#") {
      e.preventDefault();
      alert("Connect this card to a Stripe Checkout URL in the data (stripeCheckoutUrl).\nFor now this is a demo.");
    }
  };

  return (
    <div
      className="group"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "#d1d5db";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      {/* Header with name, role, and score */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 16, flex: 1, minWidth: 0 }}>
          <div>{lead.Name}</div>
          <div style={{ color: "#6b7280", fontSize: 14, fontWeight: 400 }}>{lead.Role}</div>
        </div>
        <Badge color={scoreColor(Number(lead.Score))}>Score {lead.Score}</Badge>
      </div>

      {/* Company link */}
      <a href={lead.Website} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "none"}}>
        {lead.Company}
      </a>

      {/* Brief description */}
      <div style={{ color: "#374151", fontSize: 14 }}>{lead.Brief || "High‑intent signals detected."}</div>

      {/* Tech signals badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(lead["Tech Signals"] || "").split(";").filter(t => t.trim()).map((t, idx) => (
          <Badge key={`${t.trim()}-${idx}`} color="#334155">{t.trim()}</Badge>
        ))}
      </div>

      {/* Email and actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ 
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontSize: 14,
          padding: "8px 12px",
          backgroundColor: "#f9fafb",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          wordBreak: "break-all"
        }}>
          {lead["Email (unmasked)"] ? lead["Email (unmasked)"] : maskEmail(lead["Email (masked)"] || lead["Email (unmasked)"])}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#059669" }}>${price}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href={lead.stripeCheckoutUrl || "#"}
              onClick={handleBuyClick}
              style={{
                background: "#059669",
                color: "white",
                padding: "8px 16px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
                whiteSpace: "nowrap",
              }}
            >
              Buy
            </a>
            <button
              onClick={() => onPreview(lead)}
              style={{
                background: "#ffffff",
                color: "#374151",
                padding: "8px 16px",
                borderRadius: 8,
                fontWeight: 600,
                border: "1px solid #d1d5db",
                fontSize: 14,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}