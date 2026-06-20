# MovieFinder — Internship Assignment

This is a Next.js 15 App Router application built for the Internshala Full-Stack Developer assignment. It fetches data from the TMDB API, features a fully responsive design, and uses a client-side pagination buffer to perfectly align TMDB's 20-item API pages with the required 12-item UI pages.

## Features

- **Responsive Grid**: 4 columns on desktop, 3 on tablet, 2 on mobile. Strict 2:3 aspect ratios.
- **Search**: Debounced live search with "Search as you type" functionality.
- **Details Modal**: Intercepting view that displays rich metadata without losing your place in the grid.
- **Favorites**: Persisted via `localStorage` with optimistic UI updates.
- **Smart Pagination**: Resolves TMDB's strict 20-item hard limit to deliver exactly 12 items per page without discarding any data.

## Getting Started

1. Clone the repository.
2. Ensure you have Node.js installed (v18.17+ recommended).
3. Create a `.env.local` file in the root directory and add your TMDB API Key:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_key_here
   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   NEXT_PUBLIC_TMDB_TOKEN=your_tmdb_read_access_token_here
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture Highlights

- **`useMoviesManager`**: The core hook that solves the 12 vs 20 pagination problem. It accumulates results from TMDB into a running cache and serves perfect 12-item slices to the UI, fetching ahead in the background only when necessary.
- **Tailwind + CSS Variables**: Utilizes CSS variables in `globals.css` for a centralized design system (colors, easing curves, shadow intensities).
- **Accessibility**: ARIA labels, semantic HTML tags (`<article>`, `<nav>`), `focus-visible` styles, and keyboard trap/Escape handling for the modal.

## Deployment

The project is fully compatible with Vercel. Ensure `NEXT_PUBLIC_TMDB_API_KEY` is added to the Environment Variables in your Vercel project settings before deploying.
