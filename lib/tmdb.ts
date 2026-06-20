import type {
  Movie,
  MovieDetail,
  TMDBResponse,
  PosterSize,
  BackdropSize,
} from "@/types/tmdb";

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY ?? "";
const TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN ?? "";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

// ─── Core fetcher ────────────────────────────────────────────────────────────

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  
  // If no Bearer token is provided, fallback to using the api_key in URL
  if (!TOKEN) {
    url.searchParams.set("api_key", API_KEY);
  }
  
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const headers: HeadersInit = {
    accept: "application/json",
  };

  // Prioritize the Bearer token if it exists
  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  const res = await fetch(url.toString(), { 
    headers,
    next: { revalidate: 300 } 
  });

  if (!res.ok) {
    throw new Error(`TMDB API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ─── API functions ────────────────────────────────────────────────────────────

/** Fetch a page of popular movies (20 items per TMDB page) */
export function getPopularMovies(page: number): Promise<TMDBResponse<Movie>> {
  return tmdbFetch<TMDBResponse<Movie>>("/movie/popular", {
    page: String(page),
  });
}

/** Fetch trending movies for the Hero Carousel */
export function getTrendingMovies(): Promise<TMDBResponse<Movie>> {
  return tmdbFetch<TMDBResponse<Movie>>("/trending/movie/week", {});
}

/** Search movies by title (20 items per TMDB page) */
export function searchMovies(
  query: string,
  page: number
): Promise<TMDBResponse<Movie>> {
  return tmdbFetch<TMDBResponse<Movie>>("/search/movie", {
    query: query.trim(),
    page: String(page),
    include_adult: "false",
  });
}

/** Fetch full details for a single movie */
export function getMovieDetail(id: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(`/movie/${id}`, {
    append_to_response: "credits",
  });
}

// ─── Image URL helpers ────────────────────────────────────────────────────────

export function getPosterUrl(
  path: string | null,
  size: PosterSize = "w500"
): string {
  if (!path) return "/placeholder-poster.svg";
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: BackdropSize = "w1280"
): string {
  if (!path) return "/placeholder-backdrop.svg";
  return `${IMAGE_BASE}/${size}${path}`;
}
