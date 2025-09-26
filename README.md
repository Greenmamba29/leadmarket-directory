# LeadMarket Directory

A modern, responsive Pay-Per-Lead directory built with React. Buy qualified B2B leads on demand with advanced filtering, responsive card layout, and integrated Stripe checkout functionality.

## Features

### 🎯 Core Functionality
- **Lead Directory**: Browse qualified B2B leads in a clean, responsive card layout
- **Advanced Filtering**: Search by name, company, role, industry, location, and exclusivity
- **Smart Sorting**: Sort by score, price, or last updated date
- **Modal Previews**: Detailed lead information with tech signals and source URLs
- **Masked Emails**: Email addresses are masked until purchase

### 💰 Pricing & Payment
- **Dynamic Pricing**: Price computed using `BasePrice × (Score/80) × Exclusivity Multiplier`
- **Price Range**: Automatically clamped between $15-150
- **Exclusivity Premium**: 2.5x multiplier for exclusive leads
- **Stripe Integration**: Ready for Stripe Checkout URLs (demo mode included)

### 📊 Lead Data
- **JSON Import**: Drop-in support for JSON lead imports (matches Notion CSV schema)
- **Sample Data**: 5 sample leads included for testing
- **Quality Indicators**: Color-coded scoring system (green 85+, amber 70+, red <70)
- **Tech Signals**: Track technology stack usage
- **Verification Status**: Lead quality verification indicators

### 🎨 Design & UX
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Theme**: Professional dark blue color scheme
- **No Framework Required**: Self-contained styling (Tailwind-compatible)
- **Smooth Interactions**: Hover effects and transitions
- **Accessible**: Proper ARIA labels and keyboard navigation

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:3000`

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Data Import

### JSON Structure
The app expects lead objects with these fields:

```json
{
  "Name": "Sofia Perez",
  "Company": "Luna Fitness", 
  "Role": "Head of Operations",
  "Email (masked)": "sofia [at] lunafitness.com",
  "Email (unmasked)": "", // Hidden until purchased
  "Website": "https://lunafitness.com",
  "Location": "Austin, TX",
  "Industry": "Fitness",
  "Tech Signals": "Shopify; Stripe; Klaviyo",
  "Source URLs": "https://linkedin.com/company/lunafitness/; https://lunafitness.com/careers",
  "Score": 82,
  "Verification Status": "Valid", // Valid|Risky|Unknown
  "Base Price": 40,
  "Exclusivity": "Shared", // Shared|Exclusive  
  "Sold Count": 0,
  "Last Updated": "2024-01-15",
  "stripeCheckoutUrl": "#", // Your Stripe checkout URL
  "Brief": "Growing multi-location fitness studio; active hiring and DTC stack."
}
```

### Importing Data

1. **From Notion**: Export your Notion leads database to CSV, then convert to JSON
2. **Click "Import JSON"** in the app header
3. **Select your JSON file** - supports both array format `[...]` and object format `{records: [...]}`
4. **Add Stripe URLs** (optional): Include `stripeCheckoutUrl` field for each lead

## Customization

### Site Configuration
Edit `SITE_CONFIG` in `src/DirectorySite.jsx`:

```javascript
const SITE_CONFIG = {
  title: "Your Company",
  tagline: "Your value proposition",
  guarantee: "Your guarantee message",
  supportEmail: "support@yourcompany.com",
  currency: "USD",
};
```

### Styling
- All styles are inline for maximum portability
- Tailwind-compatible class names included
- Easy to customize colors and spacing
- Dark theme variables in CSS custom properties

### Pricing Logic
Modify `computePrice()` function in `src/DirectorySite.jsx`:

```javascript
function computePrice(basePrice, score, exclusivity) {
  const mult = exclusivity === "Exclusive" ? 2.5 : 1;
  const raw = (Number(basePrice || 25) * (Number(score || 60) / 80)) * mult;
  return Math.round(clamp(raw, 15, 150));
}
```

## File Structure

```
leadmarket-directory/
├── src/
│   ├── DirectorySite.jsx    # Main component with all functionality
│   ├── App.jsx              # Root app component
│   └── main.jsx             # React entry point
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build 
- `npm run preview` - Preview production build locally
- `npm run serve` - Serve production build on port 3000

### Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server  
- **Vanilla CSS** - Styling (no framework dependencies)
- **File API** - JSON import functionality

## Deployment

### Static Hosting
Build the project and deploy the `dist/` folder to:
- Netlify
- Vercel  
- GitHub Pages
- Any static host

### Build Output
```bash
npm run build
# Outputs to dist/ folder
```

## Support & Customization

This is a fully self-contained React application with no external dependencies beyond React itself. All styling is included inline, making it easy to:

- Customize colors and branding
- Add new filtering options  
- Integrate with different payment providers
- Modify the data schema
- Add new features

## Deployment

### Option 1: Netlify (Recommended)

1. **Connect to GitHub**: 
   - Go to [Netlify](https://netlify.com) and sign up/login
   - Click "New site from Git" → "GitHub"
   - Select this repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` (set in Environment variables)

3. **Deploy**: Netlify will automatically deploy from `netlify.toml` configuration

### Option 2: Vercel

1. **Connect to GitHub**:
   - Go to [Vercel](https://vercel.com) and sign up/login
   - Click "New Project" → Import from GitHub
   - Select this repository

2. **Configure Settings**:
   - Framework Preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Deploy**: Vercel will use the `vercel.json` configuration

### Option 3: GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

2. **Create Workflow**: Add `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
             cache: 'npm'
         - run: npm ci
         - run: npm run build
         - uses: actions/deploy-pages@v2
           with:
             artifact_name: dist
   ```

## Development Guide

### Getting Started
```bash
# Clone the repository
git clone https://github.com/yourusername/leadmarket-directory.git
cd leadmarket-directory

# Install dependencies
npm install

# Start development server
npm run dev
```

### Testing Data Import
Use the included `sample-leads.json` file to test the import functionality:
1. Click "Import JSON" in the app header
2. Select the `sample-leads.json` file
3. The app will load 6 sample leads with various industries and scores

### Environment Variables
For production deployment, you can set:
- `NODE_VERSION=18` (for build environments)
- Custom environment variables as needed

## Architecture Notes

This application uses a **monolithic single-component architecture** intentionally:
- All functionality is in `src/DirectorySite.jsx` (514 lines)
- No external state management (uses React hooks)
- No routing (single page application)
- Self-contained styling (no external CSS frameworks)
- Easy to understand, modify, and deploy

## Performance Features

- **Optimized Build**: Vite provides fast builds with tree shaking
- **Lazy Loading**: React components render efficiently
- **Caching**: Static assets are cached with long expiry headers
- **Compression**: Gzip compression enabled for all deployments
- **Source Maps**: Available in development for debugging

## License

MIT License - feel free to use this in your own projects.
