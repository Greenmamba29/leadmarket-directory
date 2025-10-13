import React from 'react';

/**
 * SearchFilters component for lead filtering and search
 * @param {Object} props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Callback for search query changes
 * @param {string} props.selectedIndustry - Currently selected industry filter
 * @param {Function} props.onIndustryChange - Callback for industry filter changes
 * @param {string} props.selectedLocation - Currently selected location filter
 * @param {Function} props.onLocationChange - Callback for location filter changes
 * @param {string} props.selectedExclusivity - Currently selected exclusivity filter
 * @param {Function} props.onExclusivityChange - Callback for exclusivity filter changes
 * @param {string} props.selectedSort - Currently selected sort option
 * @param {Function} props.onSortChange - Callback for sort changes
 * @param {string[]} props.industries - Available industry options
 * @param {string[]} props.locations - Available location options
 * @returns {React.ReactElement}
 */
export default function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  selectedLocation,
  onLocationChange,
  selectedExclusivity,
  onExclusivityChange,
  selectedSort,
  onSortChange,
  industries = [],
  locations = [],
}) {
  const exclusivityOptions = ['All', 'Shared', 'Exclusive'];
  const sortOptions = [
    { value: 'score-desc', label: 'Top Score' },
    { value: 'score-asc', label: 'Low Score' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'recent', label: 'Recently Updated' },
  ];

  const inputStyle = {
    background: "#111827",
    color: "white",
    border: "1px solid #1f2937",
    borderRadius: 12,
    padding: "10px 12px",
  };

  return (
    <section style={{ padding: "12px 16px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "#0f172a", border: "1px solid #1f2937", borderRadius: 16, padding: 16 }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: 12,
          '@media (max-width: 768px)': {
            gridTemplateColumns: "1fr"
          }
        }}>
          {/* Search input */}
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, company, role, industry, geo…"
            style={inputStyle}
          />

          {/* Industry filter */}
          <select 
            value={selectedIndustry} 
            onChange={(e) => onIndustryChange(e.target.value)} 
            style={inputStyle}
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>

          {/* Location filter */}
          <select 
            value={selectedLocation} 
            onChange={(e) => onLocationChange(e.target.value)} 
            style={inputStyle}
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          {/* Exclusivity filter */}
          <select 
            value={selectedExclusivity} 
            onChange={(e) => onExclusivityChange(e.target.value)} 
            style={inputStyle}
          >
            {exclusivityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          {/* Sort options */}
          <select 
            value={selectedSort} 
            onChange={(e) => onSortChange(e.target.value)} 
            style={inputStyle}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}