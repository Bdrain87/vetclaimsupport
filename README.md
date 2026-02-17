# Vet Claim Support

A Progressive Web App (PWA) designed to help U.S. veterans track medical visits, exposures, symptoms, medications, and documentation for VA disability claims.

## Features

### Health Tracking
- **Symptom Journal** - Log symptoms with severity, frequency, and daily impact
- **Migraine Log** - Track migraines aligned with VA rating criteria (38 CFR 4.124a DC 8100)
- **Sleep Tracker** - Sleep apnea tracking per VA criteria (38 CFR 4.97 DC 6847)
- **Medication Log** - Track medications, dosages, and side effects

### Evidence Building
- **Document Upload** - Upload and organize medical records, buddy statements, and evidence
- **Evidence Library** - Centralized document management with categories
- **Buddy Statements** - Track witness contacts and statement status
- **Timeline Builder** - Visual timeline of service history and events

### Claim Tools
- **C&P Exam Prep** - Condition-specific preparation questions
- **Documents Checklist** - Track required VA documents
- **Service History** - Duty stations, combat history, deployments, and major events
- **Rating Calculator** - Estimate combined VA disability rating

### Reference Database
- **785+ VA Conditions** - Complete 38 CFR Part 4 reference database
- **Secondary Conditions** - Suggested secondary condition connections
- **DBQ Guidance** - Disability Benefits Questionnaire criteria
- **VA Forms Reference** - Required forms for each condition

### AI-Powered Features (Optional)
- **Symptom Analyzer** - AI-powered condition suggestions based on your evidence
- **Smart Recommendations** - Identify potential secondary conditions

## Privacy First

We prioritize privacy and security:

- **Local-First Storage** - Data stored in your browser (localStorage/IndexedDB) by default
- **Optional Cloud Sync** - Sign in with Supabase auth to sync across devices; your data stays in your control
- **No Tracking** - No analytics, cookies, or third-party trackers
- **Optional AI** - AI features only activate when you explicitly request them and are processed server-side via Supabase Edge Functions
- **Data Export** - Export your data anytime as JSON backup

## Tech Stack

- **Frontend:** React 18 + TypeScript 5
- **Build:** Vite 5
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Context + TanStack Query
- **Storage:** localStorage + IndexedDB
- **PWA:** Workbox with offline support
- **AI:** Google Gemini API (optional, via Supabase Edge Functions)

## Local Development

### Prerequisites
- Node.js 18+
- npm or bun

### Setup

```bash
# Clone the repository
git clone https://github.com/Bdrain87/vetclaimsupport.git
cd vetclaimsupport

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file for Supabase integration (optional):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run test     # Run tests
```

## Project Structure

```
src/
├── components/     # React components
│   ├── dashboard/  # Dashboard widgets
│   ├── landing/    # Landing page
│   ├── pwa/        # PWA components
│   ├── settings/   # Settings components
│   ├── tools/      # Claim tools
│   └── ui/         # shadcn/ui components
├── context/        # React Context providers
├── data/           # Static reference data (VA conditions, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries
├── pages/          # Route pages
├── test/           # Test files
├── types/          # TypeScript types
└── utils/          # Utility functions

supabase/
└── functions/      # Supabase Edge Functions
```

## Security

- **TypeScript Strict Mode** - Enabled for type safety
- **Content Security Policy** - Configured via Vercel headers
- **CORS Restricted** - API endpoints restricted to production domain
- **Input Validation** - Zod schema validation on forms
- **No Secrets in Code** - Environment variables for sensitive config

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © 2024-2026 Vet Claim Support. All rights reserved.

## Disclaimer

This application is an educational tool only. It does not provide legal, medical, or VA advice. Always consult with a qualified Veterans Service Officer (VSO) or attorney for claim decisions.
