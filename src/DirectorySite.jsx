import React, { useState, useRef } from "react";
import LeadCard from './components/LeadCard.jsx';
import SearchFilters from './components/SearchFilters.jsx';
import LeadModal from './components/LeadModal.jsx';
import { useLeadFiltering } from './hooks/useLeadFiltering.js';
import { useLeadImport } from './hooks/useLeadImport.js';
import { SITE_CONFIG } from './config/siteConfig.js';
import { SAMPLE_LEADS } from './data/sampleLeads.js';

/**
 * Pay‑Per‑Lead Directory — Modular React Application
 * -------------------------------------------------
 * Modern component-based architecture with:
 * • Modular components for maintainability
 * • Custom hooks for business logic separation
 * • Utility functions for reusable calculations
 * • Clean separation of concerns
 * • Enhanced accessibility and responsiveness
 */

// ---- Main Component --------------------------------------------------------
export default function DirectorySite() {
  // State management
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedExclusivity, setSelectedExclusivity] = useState("All");
  const [sortOption, setSortOption] = useState("score-desc");
  const [modalLead, setModalLead] = useState(null);
  const fileRef = useRef(null);

  // Custom hooks
  const { filteredLeads, industries, locations } = useLeadFiltering(
    leads,
    searchQuery,
    selectedIndustry,
    selectedLocation,
    selectedExclusivity,
    sortOption
  );

  const { isLoading, error, importFile, clearError } = useLeadImport();

  // Event handlers
  const handleImportClick = () => fileRef.current?.click();
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importFile(file, (newLeads) => {
        setLeads(newLeads);
        if (fileRef.current) {
          fileRef.current.value = '';
        }
      });
    }
  };

  const handlePreview = (lead) => setModalLead(lead);
  const handleCloseModal = () => setModalLead(null);

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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
            <input ref={fileRef} type="file" accept="application/json" onChange={handleFileChange} hidden />
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
                onClick={clearError}
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
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedExclusivity={selectedExclusivity}
        onExclusivityChange={setSelectedExclusivity}
        selectedSort={sortOption}
        onSortChange={setSortOption}
        industries={industries}
        locations={locations}
      />

      {/* Results */}
      <main style={{ padding: 16 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ color: "#cbd5e1", margin: "12px 4px" }}>{filteredLeads.length} leads</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat( auto-fill, minmax(300px, 1fr) )",
            gap: 16,
          }}>
            {filteredLeads.map((lead, idx) => (
              <LeadCard key={`${lead.Company}-${lead.Name}-${idx}`} lead={lead} onPreview={handlePreview} />
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
      <LeadModal lead={modalLead} onClose={handleCloseModal} />
    </div>
  );
}