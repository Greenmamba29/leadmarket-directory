import { useMemo } from 'react';
import { computePrice } from '../utils/pricing.js';

/**
 * Custom hook for lead filtering and sorting logic
 * @param {Array} leads - Array of lead objects
 * @param {string} searchQuery - Search query string
 * @param {string} selectedIndustry - Selected industry filter
 * @param {string} selectedLocation - Selected location filter  
 * @param {string} selectedExclusivity - Selected exclusivity filter
 * @param {string} sortOption - Selected sort option
 * @returns {Object} - Filtered leads and filter options
 */
export function useLeadFiltering(leads, searchQuery, selectedIndustry, selectedLocation, selectedExclusivity, sortOption) {
  // Generate filter options from leads data
  const industries = useMemo(() => [
    "All", 
    ...Array.from(new Set(leads.map(l => (l.Industry || "").trim()).filter(Boolean)))
  ], [leads]);

  const locations = useMemo(() => [
    "All", 
    ...Array.from(new Set(leads.map(l => (l.Location || "").trim()).filter(Boolean)))
  ], [leads]);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Apply text search filter
    if (searchQuery) {
      const needle = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => (
        (lead.Name || "").toLowerCase().includes(needle) ||
        (lead.Company || "").toLowerCase().includes(needle) ||
        (lead.Role || "").toLowerCase().includes(needle) ||
        (lead.Industry || "").toLowerCase().includes(needle) ||
        (lead.Location || "").toLowerCase().includes(needle)
      ));
    }

    // Apply industry filter
    if (selectedIndustry !== "All") {
      filtered = filtered.filter(lead => (lead.Industry || "") === selectedIndustry);
    }

    // Apply location filter
    if (selectedLocation !== "All") {
      filtered = filtered.filter(lead => (lead.Location || "") === selectedLocation);
    }

    // Apply exclusivity filter
    if (selectedExclusivity !== "All") {
      filtered = filtered.filter(lead => (lead.Exclusivity || "") === selectedExclusivity);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const priceA = computePrice(a["Base Price"], a.Score, a.Exclusivity);
      const priceB = computePrice(b["Base Price"], b.Score, b.Exclusivity);
      
      switch (sortOption) {
        case "score-desc": 
          return Number(b.Score || 0) - Number(a.Score || 0);
        case "score-asc": 
          return Number(a.Score || 0) - Number(b.Score || 0);
        case "price-desc": 
          return priceB - priceA;
        case "price-asc": 
          return priceA - priceB;
        case "recent": 
          return new Date(b["Last Updated"]) - new Date(a["Last Updated"]);
        default: 
          return 0;
      }
    });

    return filtered;
  }, [leads, searchQuery, selectedIndustry, selectedLocation, selectedExclusivity, sortOption]);

  return {
    filteredLeads,
    industries,
    locations,
  };
}