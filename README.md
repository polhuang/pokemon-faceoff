# Pokemon Faceoff

A minimalist Pokemon vs Pokemon voting site built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Vote Page**: Side-by-side Pokemon battles with clean, minimalist UI
- **Results Page**: Pokemon ranked by win rate with detailed statistics
- **Real-time Stats**: Track wins, losses, and win rates for each Pokemon
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your database credentials (see Deployment section below for Vercel setup)

3. Start the development server:
```bash
npm run dev:agent
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment to Vercel

1. **Create Vercel Project**:
   - Connect your GitHub repository to Vercel
   - Deploy the project

2. **Add Vercel Postgres Database**:
   - In your Vercel dashboard, go to your project
   - Navigate to the "Storage" tab
   - Click "Create" and select "Postgres"
   - This will automatically set up environment variables

3. **Deploy**:
   - The app will automatically deploy with persistent vote storage
   - Votes will persist across deployments and server restarts

## How to Use

1. **Voting**: On the vote page, you'll see two Pokemon side-by-side. Click on your favorite to vote!
2. **Results**: Check the results page to see which Pokemon are winning the most battles
3. **Navigation**: Use the navigation buttons to switch between voting and results

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vercel Postgres** - Database for persistent vote storage
- **Vercel** - Deployment platform

## Pokemon Data

The app includes 10 popular Pokemon from the original generation:
- Pikachu, Charizard, Blastoise, Venusaur
- Mewtwo, Mew, Dragonite, Snorlax
- Gengar, Machamp

Each Pokemon has their official sprite from the Pokemon API.

## Data Storage

The app now uses **Vercel Postgres** for persistent vote storage. All votes are stored in a PostgreSQL database, ensuring data persists across deployments and server restarts.

### Database Schema

- `pokemon_votes` table stores vote statistics for each Pokemon
- Columns: `pokemon_id`, `wins`, `losses`, `total_votes`, `created_at`, `updated_at`
- Votes are recorded via API routes and stored permanently