"use client";

import { useState, useEffect } from "react";
import { getMovieDetail } from "@/lib/tmdb";
import type { MovieDetail, FetchStatus } from "@/types/tmdb";

interface MovieDetailState {
  movie: MovieDetail | null;
  status: FetchStatus;
  error: string | null;
}

/**
 * useMovieDetail
 *
 * Fetches full movie details (and credits via append_to_response)
 * when a movie ID is provided. Clears on null.
 */
export function useMovieDetail(id: number | null): MovieDetailState {
  const [state, setState] = useState<MovieDetailState>({
    movie: null,
    status: "idle",
    error: null,
  });

  useEffect(() => {
    if (id === null) {
      setState({ movie: null, status: "idle", error: null });
      return;
    }

    let cancelled = false;

    setState({ movie: null, status: "loading", error: null });

    getMovieDetail(id)
      .then((data) => {
        if (!cancelled) {
          setState({ movie: data, status: "success", error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            movie: null,
            status: "error",
            error: err instanceof Error ? err.message : "Failed to load movie",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
