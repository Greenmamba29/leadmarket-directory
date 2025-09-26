import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * Pay‑Per‑Lead Directory — One‑Page React Site
 * -------------------------------------------------
 * • Clean, responsive directory layout (cards + filters + modal)
 * • Masked emails until purchase
 * • Price computed from BasePrice × (Score/80) × Exclusivity Multiplier (clamped 15–150)
 * • Drop‑in JSON import for leads (matches the Notion pack schema)
 * • Stripe Checkout links per lead (placeholder demo)
 * • No external CSS framework required (Tailwind classes included for projects using Tailwind).
 *   The layout also includes minimal inline styles so it still looks decent without Tailwind.
 *
 * To use live data:
 *  1) Export your Notion Leads DB to JSON (or convert the CSV to JSON).
 *  2) Click "Import JSON" and select that file. Keys should match the sample schema below.
 *  3) (Optional) Put your Stripe Checkout URLs into each lead's `stripeCheckoutUrl` field.
 */

// ---- Site Config -----------------------------------------------------------
const SITE_CONFIG = {
  title: "LeadMarket",
  tagline: "Buy qualified B2B leads on demand.",
  guarantee: "72‑hour quality guarantee • auto‑refund on hard bounces, duplicates, or wrong niche",
  supportEmail: "support@leadmarket.example",
  currency: "USD",
};

// ---- Helpers ---------------------------------------------------------------
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const maskEmail = (email) => {
  if (!email) return "";
  return email.replace(/@/g, " [at] ");
};

function computePrice(basePrice, score, exclusivity) {
  const mult = exclusivity === "Exclusive" ? 2.5 : 1;
  const raw = (Number(basePrice || 25) * (Number(score || 60) / 80)) * mult;
  return Math.round(clamp(raw, 15, 150));
}

function scoreColor(score) {
  if (score >= 85) return "#10b981"; // green
  if (score >= 70) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

// ---- Sample Data (matches Notion CSV pack) --------------------------------
const SAMPLE_LEADS = [
  {
    Name: "Sofia Perez",
    Company: "Luna Fitness",
    Role: "Head of Operations",
    "Email (masked)": "sofia [at] lunafitness.com",
    "Email (unmasked)": "",
    Website: "https://lunafitness.com",
    Location: "Austin, TX",
    Industry: "Fitness",
    "Tech Signals": "Shopify; Stripe; Klaviyo",
    "Source URLs": "https://www.linkedin.com/company/lunafitness/; https://lunafitness.com/careers",
    Score: 82,
    "Verification Status": "Valid",
    "Base Price": 40,
    Exclusivity: "Shared",
    "Sold Count": 0,
    "Last Updated": new Date().toISOString().slice(0,10),
    stripeCheckoutUrl: "#",
    Brief: "Growing multi‑location fitness studio; active hiring and DTC stack.",
  },
  {
    Name: "Devin Brooks",
    Company: "Nimbus Logistics",
    Role: "IT Director",
    "Email (masked)": "devin [at] nimbuslogistics.io",
    "Email (unmasked)": "",
    Website: "https://nimbuslogistics.io",
    Location: "Columbus, OH",
    Industry: "Logistics",
    "Tech Signals": "HubSpot; NetSuite; GCP",
    "Source URLs": "https://jobs.nimbuslogistics.io/; https://nimbuslogistics.io/news",
    Score: 75,
    "Verification Status": "Risky",
    "Base Price": 45,
    Exclusivity: "Exclusive",
    "Sold Count": 0,
    "Last Updated": new Date().toISOString().slice(0,10),
    stripeCheckoutUrl: "#",
    Brief: "3PL platform with recent infra expansion; engineering hires posted.",
  },
  {
    Name: "Amara Njeri",
    Company: "Kilimanjaro Tours",
    Role: "Marketing Manager",
    "Email (masked)": "amara [at] kilitours.africa",
    "Email (unmasked)": "",
    Website: "https://kilitours.africa",
    Location: "Arusha, TZ",
    Industry: "Travel",
    "Tech Signals": "WordPress; Meta Ads; GA4",
    "Source URLs": "https://kilitours.africa/blog; https://www.facebook.com/kilitours",
    Score: 64,
    "Verification Status": "Unknown",
    "Base Price": 35,
    Exclusivity: "Shared",
    "Sold Count": 0,
    "Last Updated": new Date().toISOString().slice(0,10),
    stripeCheckoutUrl: "#",
    Brief: "Safari operator with active content pipeline; seasonal campaigns.",
  },
  {
    Name: "Kenji Sato",
    Company: "Aster Robotics",
    Role: "VP Engineering",
    "Email (masked)": "kenji [at] aster-robotics.com",
    "Email (unmasked)": "",
    Website: "https://aster-robotics.com",
    Location: "San Jose, CA",
    Industry: "Manufacturing",
    "Tech Signals": "AWS; Snowflake; Segment",
    "Source URLs": "https://aster-robotics.com/careers; https://news.aster-robotics.com",
    Score: 91,
    "Verification Status": "Valid",
    "Base Price": 60,
    Exclusivity: "Exclusive",
    "Sold Count": 0,
    "Last Updated": new Date().toISOString().slice(0,10),
    stripeCheckoutUrl: "#",
    Brief: "Robotics OEM scaling data stack; senior eng roles open.",
  },
  {
    Name: "Lucia Romero",
    Company: "Verdant Farms",
    Role: "Operations Lead",
    "Email (masked)": "lucia [at] verdantfarms.co",
    "Email (unmasked)": "",
    Website: "https://verdantfarms.co",
    Location: "Fresno, CA",
    Industry: "AgTech",
    "Tech Signals": "QuickBooks; Airtable; Twilio",
    "Source URLs": "https://verdantfarms.co/team; https://verdantfarms.co/contact",
    Score: 58,
    "Verification Status": "Unknown",
    "Base Price": 30,
    Exclusivity: "Shared",
    "Sold Count": 0,
    "Last Updated": new Date().toISOString().slice(0,10),
    stripeCheckoutUrl: "#",
    Brief: "Ag operations modernization; data capture initiatives noted.",
  },
];

// ---- Components ------------------------------------------------------------
function Badge({ children, color }) {
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

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal
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
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(960px, 96vw)",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 10px 40px rgba(2,6,23,0.35)",
          padding: 24,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function LeadCard({ lead, onPreview }) {
  const price = computePrice(lead["Base Price"], lead.Score, lead.Exclusivity);
  return (
    <div
      className="group"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "box-shadow .2s ease, transform .2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{lead.Name} · <span style={{ color: "#6b7280" }}>{lead.Role}</span></div>
        <Badge color={scoreColor(Number(lead.Score))}>Score {lead.Score}</Badge>
      </div>
      <a href={lead.Website} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "none"}}>
        {lead.Company}
      </a>
      <div style={{ color: "#374151", fontSize: 14 }}>{lead.Brief || "High‑intent signals detected."}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(lead["Tech Signals"] || "").split(";").map((t) => (
          <Badge key={t.trim()} color="#334155">{t.trim()}</Badge>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" }}>
          {lead["Email (unmasked)"] ? lead["Email (unmasked)"] : maskEmail(lead["Email (masked)"] || lead["Email (unmasked)"])}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>${price}</div>
          <a
            href={lead.stripeCheckoutUrl || "#"}
            onClick={(e) => {
              if (!lead.stripeCheckoutUrl || lead.stripeCheckoutUrl === "#") {
                e.preventDefault();
                alert("Connect this card to a Stripe Checkout URL in the data (stripeCheckoutUrl).\nFor now this is a demo.");
              }
            }}
            style={{
              background: "#111827",
              color: "white",
              padding: "10px 14px",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Buy
          </a>
          <button
            onClick={() => onPreview(lead)}
            style={{
              background: "#f3f4f6",
              color: "#111827",
              padding: "10px 14px",
              borderRadius: 12,
              fontWeight: 600,
              border: "1px solid #e5e7eb",
            }}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Main Page -------------------------------------------------------------
export default function DirectorySite() {
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("All");
  const [geo, setGeo] = useState("All");
  const [excl, setExcl] = useState("All");
  const [sort, setSort] = useState("score-desc");
  const [modalLead, setModalLead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const industries = useMemo(() => ["All", ...Array.from(new Set(leads.map(l => (l.Industry || "").trim()).filter(Boolean)))], [leads]);
  const geos = useMemo(() => ["All", ...Array.from(new Set(leads.map(l => (l.Location || "").trim()).filter(Boolean)))], [leads]);

  const filtered = useMemo(() => {
    let rows = [...leads];
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter(l => (
        (l.Name||"").toLowerCase().includes(needle) ||
        (l.Company||"").toLowerCase().includes(needle) ||
        (l.Role||"").toLowerCase().includes(needle) ||
        (l.Industry||"").toLowerCase().includes(needle) ||
        (l.Location||"").toLowerCase().includes(needle)
      ));
    }
    if (industry !== "All") rows = rows.filter(l => (l.Industry||"") === industry);
    if (geo !== "All") rows = rows.filter(l => (l.Location||"") === geo);
    if (excl !== "All") rows = rows.filter(l => (l.Exclusivity||"") === excl);

    rows.sort((a,b) => {
      const aP = computePrice(a["Base Price"], a.Score, a.Exclusivity);
      const bP = computePrice(b["Base Price"], b.Score, b.Exclusivity);
      switch (sort) {
        case "score-desc": return Number(b.Score||0) - Number(a.Score||0);
        case "score-asc": return Number(a.Score||0) - Number(b.Score||0);
        case "price-desc": return bP - aP;
        case "price-asc": return aP - bP;
        case "recent": return new Date(b["Last Updated"]) - new Date(a["Last Updated"]);
        default: return 0;
      }
    });

    return rows;
  }, [leads, q, industry, geo, excl, sort]);

  // Enhanced JSON import with validation and error handling
  function onImportJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        let leadsArray = [];
        
        if (Array.isArray(data)) {
          leadsArray = data;
        } else if (Array.isArray(data?.records)) {
          leadsArray = data.records;
        } else {
          throw new Error("JSON must be an array of lead objects or {records: [...]}.");
        }
        
        // Validate lead structure
        const requiredFields = ['Name', 'Company', 'Role'];
        const invalidLeads = leadsArray.filter(lead => 
          !requiredFields.every(field => lead[field])
        );
        
        if (invalidLeads.length > 0) {
          throw new Error(`Found ${invalidLeads.length} leads missing required fields (Name, Company, Role).`);
        }
        
        setLeads(leadsArray);
        setError(null);
        
        // Reset file input
        if (fileRef.current) {
          fileRef.current.value = '';
        }
        
      } catch (err) {
        setError(err.message || "Invalid JSON file format.");
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError("Failed to read file.");
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  }

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ padding: "24px 16px" }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#60a5fa,#34d399)", boxShadow: "0 6px 24px rgba(59,130,246,.35)" }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{SITE_CONFIG.title}</div>
              <div style={{ color: "#cbd5e1", fontSize: 13 }}>{SITE_CONFIG.tagline}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={isLoading}
              style={{ 
                background: isLoading ? "#374151" : "#111827", 
                color: "white", 
                padding: "10px 14px", 
                borderRadius: 10, 
                border: "1px solid #1f2937",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? "Importing..." : "Import JSON"}
            </button>
            <input ref={fileRef} type="file" accept="application/json" onChange={onImportJSON} hidden />
            <a href="#credits" style={{ background: "#22c55e", color: "#052e16", padding: "10px 14px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
              Buy Credits
            </a>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <section style={{ padding: "12px 16px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#dc2626"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: 4
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section style={{ padding: "12px 16px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", background: "#0f172a", border: "1px solid #1f2937", borderRadius: 16, padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 12 }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, company, role, industry, geo…"
              style={{
                background: "#111827", color: "white", border: "1px solid #1f2937", borderRadius: 12, padding: "10px 12px",
              }}
            />
            <select value={industry} onChange={(e)=>setIndustry(e.target.value)} style={{ background: "#111827", color: "white", border: "1px solid #1f2937", borderRadius: 12, padding: "10px 12px" }}>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={geo} onChange={(e)=>setGeo(e.target.value)} style={{ background: "#111827", color: "white", border: "1px solid #1f2937", borderRadius: 12, padding: "10px 12px" }}>
              {geos.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={excl} onChange={(e)=>setExcl(e.target.value)} style={{ background: "#111827", color: "white", border: "1px solid #1f2937", borderRadius: 12, padding: "10px 12px" }}>
              {['All','Shared','Exclusive'].map(x => <option key={x} value={x}>{x}</option>)}
            </select>
            <select value={sort} onChange={(e)=>setSort(e.target.value)} style={{ background: "#111827", color: "white", border: "1px solid #1f2937", borderRadius: 12, padding: "10px 12px" }}>
              <option value="score-desc">Top Score</option>
              <option value="score-asc">Low Score</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="recent">Recently Updated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <main style={{ padding: 16 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ color: "#cbd5e1", margin: "12px 4px" }}>{filtered.length} leads</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat( auto-fill, minmax(300px, 1fr) )",
            gap: 16,
          }}>
            {filtered.map((lead, idx) => (
              <LeadCard key={idx} lead={lead} onPreview={setModalLead} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: 24, borderTop: "1px solid #1f2937", color: "#cbd5e1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, color: "white" }}>{SITE_CONFIG.guarantee}</div>
            <div style={{ fontSize: 13 }}>Questions? <a href={`mailto:${SITE_CONFIG.supportEmail}`} style={{ color: "#60a5fa" }}>{SITE_CONFIG.supportEmail}</a></div>
          </div>
          <div style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} {SITE_CONFIG.title}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Preview Modal */}
      <Modal open={!!modalLead} onClose={() => setModalLead(null)}>
        {modalLead && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{modalLead.Company}</div>
                <div style={{ color: "#374151" }}>{modalLead.Name} — {modalLead.Role}</div>
              </div>
              <Badge color={scoreColor(Number(modalLead.Score))}>Score {modalLead.Score}</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, color: "#111827" }}>{modalLead.Brief || "High‑intent signals detected."}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(modalLead["Tech Signals"] || "").split(";").map((t) => (
                    <Badge key={t.trim()} color="#334155">{t.trim()}</Badge>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontSize: 14 }}>
                  <strong>Location:</strong> {modalLead.Location || "—"}
                </div>
                <div style={{ fontSize: 14 }}>
                  <strong>Industry:</strong> {modalLead.Industry || "—"}
                </div>
                <div style={{ fontSize: 14 }}>
                  <strong>Verification:</strong> {modalLead["Verification Status"] || "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, marginBottom: 6 }}><strong>Sources</strong></div>
                <ul style={{ listStyle: "disc", paddingLeft: 18, display: "grid", gap: 6 }}>
                  {(modalLead["Source URLs"]||"").split(";").map((u, i) => (
                    <li key={i}>
                      <a href={u.trim()} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                        {u.trim()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontWeight: 900, fontSize: 22 }}>
                ${computePrice(modalLead["Base Price"], modalLead.Score, modalLead.Exclusivity)}
              </div>
              <a
                href={modalLead.stripeCheckoutUrl || "#"}
                onClick={(e) => {
                  if (!modalLead.stripeCheckoutUrl || modalLead.stripeCheckoutUrl === "#") {
                    e.preventDefault();
                    alert("Connect this lead to a Stripe Checkout URL in the data (stripeCheckoutUrl).\nFor now this is a demo.");
                  }
                }}
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
              <a href={modalLead.Website} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Visit site</a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}