# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm install                    # Install dependencies
npm run dev                    # Start development server (opens at http://localhost:3000)
npm run build                  # Create production build (outputs to dist/)
npm run preview                # Preview production build locally
npm run serve                  # Serve production build on port 3000
```

### Development Workflow
- Use `npm run dev` for active development with hot reload
- Use `npm run build && npm run preview` to test production builds locally
- All builds output to the `dist/` directory with sourcemaps enabled

## Architecture Overview

### Single-Component Architecture
This is a **single-page React application** built around one primary component (`src/DirectorySite.jsx`) containing all functionality. The architecture is intentionally monolithic for simplicity and portability.

**Key Components:**
- `src/main.jsx` - React entry point
- `src/App.jsx` - Simple wrapper that renders DirectorySite
- `src/DirectorySite.jsx` - **Main component (514 lines)** containing all functionality
- `index.html` - HTML template with minimal global styles

### Data Architecture
The application operates on a **JSON-based lead data structure** with the following key fields:
- `Name`, `Company`, `Role` - Contact information
- `Email (masked)` - Displayed email with @ symbols replaced
- `Email (unmasked)` - Hidden until purchase
- `Score` - Lead quality score (0-100, affects pricing)
- `Base Price`, `Exclusivity` - Pricing parameters
- `Tech Signals`, `Industry`, `Location` - Filtering attributes
- `stripeCheckoutUrl` - Payment integration

### Pricing Logic
Dynamic pricing computed by the `computePrice()` function:
```
Price = BasePrice × (Score/80) × ExclusivityMultiplier
- Exclusive leads: 2.5× multiplier
- Price range clamped between $15-150
```

### State Management
Uses React hooks with no external state management:
- `useState` for all component state (leads, filters, modal)
- `useMemo` for computed values (filtered leads, dropdown options)
- `useRef` for file input handling

## Key Features to Understand

### 1. Lead Filtering System
Implements real-time filtering across multiple dimensions:
- Text search (name, company, role, industry, location)
- Industry dropdown (dynamically populated)
- Location dropdown (dynamically populated)
- Exclusivity filter (Shared/Exclusive)
- Sort options (score, price, date)

### 2. JSON Import System
The `onImportJSON` function handles lead data import:
- Supports array format `[...]` or object format `{records: [...]}`
- Replaces existing leads completely
- No validation beyond JSON parsing

### 3. Modal Preview System
Lead cards trigger a detailed modal showing:
- Full lead information including sources
- Tech signals as badges
- Verification status
- Purchase button with Stripe integration

### 4. Payment Integration
Stripe Checkout URLs are stored per-lead in the `stripeCheckoutUrl` field. The app shows demo alerts when URLs are missing.

## Configuration

### Site Branding
Edit `SITE_CONFIG` object in `src/DirectorySite.jsx`:
```javascript
const SITE_CONFIG = {
  title: "LeadMarket",
  tagline: "Buy qualified B2B leads on demand.",
  guarantee: "72‑hour quality guarantee • auto‑refund on hard bounces, duplicates, or wrong niche",
  supportEmail: "support@leadmarket.example",
  currency: "USD",
};
```

### Sample Data
5 sample leads are included in `SAMPLE_LEADS` array for development/testing.

## Styling Approach

### Self-Contained Styling
- **No external CSS frameworks required**
- All styles are inline for maximum portability
- Includes Tailwind-compatible class names (commented but unused)
- Dark theme with professional color scheme (#0b1220 background)
- Responsive design using CSS Grid and Flexbox

### Color System
- Background: `#0b1220` (dark blue)
- Cards: `#ffffff` (white)
- UI elements: `#111827` (dark gray)
- Borders: `#e5e7eb`, `#1f2937`
- Score colors: Green (85+), Amber (70-84), Red (<70)

## Development Notes

### File Structure Logic
The minimal file structure reflects the intentional simplicity:
- Most functionality is contained in `DirectorySite.jsx` 
- No routing, no complex state management
- Self-contained for easy customization and deployment

### Tech Stack Rationale
- **React 18** - Modern React with hooks
- **Vite** - Fast development server and build tool
- **No testing framework** - Simple enough to test manually
- **No linting** - Clean, readable code by design

### Deployment Considerations
Static hosting ready - the build output is a standard SPA that can be deployed to any static host (Netlify, Vercel, GitHub Pages).

## Common Modifications

When extending this application, typical changes include:
1. **Data Schema**: Modify the lead object structure and update filtering/display logic
2. **Pricing Logic**: Adjust the `computePrice()` function parameters
3. **Filtering Options**: Add new filter dimensions in the filtering section
4. **Styling**: Modify inline styles or add CSS classes for Tailwind integration
5. **Payment Integration**: Replace Stripe demo with actual checkout URLs

The monolithic structure makes these modifications straightforward as all related code is in the same file.