export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string; // "YYYY-MM-DD"
  vote_average: number; // 0–10
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Omit<Movie, "genre_ids"> {
  runtime: number; // minutes
  genres: Genre[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export type FetchStatus = "idle" | "loading" | "error" | "success";

export type Tab = "browse" | "favorites";

export type PosterSize = "w92" | "w185" | "w342" | "w500" | "original";
export type BackdropSize = "w300" | "w780" | "w1280" | "original";
