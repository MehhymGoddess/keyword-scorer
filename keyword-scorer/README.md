# Keyword Opportunity Scorer

A Next.js web application for scoring Google Keyword Planner keywords based on volume, competition, and bid price. Optimized for local franchise quick wins.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm start
```

## Scoring Model

The scoring system evaluates keywords on three components:

### Volume Score (0-40 points)
- Under 50 searches: 0 points
- 50-500 searches: 25 points
- 500-2000 searches: 40 points (sweet spot)
- 2000-5000 searches: 30 points
- 5000+ searches: 15 points

### Competition Score (0-40 points)
- Low: 40 points
- Medium: 20 points
- High: 10 points

### Price Score (0-20 points)
- Under $1: 0 points
- $1-2: 20 points (ideal)
- $2-4: 20 points (ideal)
- $4-5: 15 points
- $5-8: 5 points
- $8+: 0 points

**Total Score: 0-100 points**

## Deployment on Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Deploy

That's it! Your app will be live.

## Features

- Upload Google Keyword Planner CSV exports
- Automatic keyword scoring
- Filter by minimum score
- Download scored results as CSV
- Optional client name tracking

## Future Enhancements

- Database storage for tracking historical scores
- User authentication
- Client dashboard
- Campaign performance tracking
- API for programmatic access
