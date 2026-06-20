"use client";

import { useState, useCallback, useRef } from "react";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";
import type { Movie, FetchStatus } from "@/types/tmdb";

const ITEMS_PER_UI_PAGE = 12;
const ITEMS_PER_API_PAGE = 20;

interface MoviesManagerState {
  cache: Movie[];
  apiPage: number;        // last TMDB page we fetched
  uiPage: number;         // current 12-item slice (1-indexed)
  totalResults: number;
  totalUiPages: number;
  status: FetchStatus;
  error: string | null;
}

interface MoviesManagerReturn extends MoviesManagerState {
  currentMovies: Movie[];
  goToNextPage: () => void;
  goToPrevPage: () => void;
  reset: (query?: string) => void;
}

/**
 * useMoviesManager
 *
 * Core pagination buffer hook.
 *
 * Problem: TMDB returns exactly 20 items per API page.
 * The assignment requires exactly 12 items per UI page.
 * Naively slicing 12 from each 20-item fetch loses items 13–20 permanently.
 *
 * Solution: Accumulate all fetched items into a rolling `cache[]`.
 * Serve 12-item slices from that cache.
 * When the cache doesn't have enough items for the next UI page,
 * fetch the next TMDB API page, merge it in, then serve the slice.
 *
 * Going backward is always instant — items are already in cache.
 */
export function useMoviesManager(initialQuery?: string): MoviesManagerReturn {
  const queryRef = useRef<string | undefined>(initialQuery);

  const [state, setState] = useState<MoviesManagerState>({
    cache: [],
    apiPage: 0,
    uiPage: 1,
    totalResults: 0,
    totalUiPages: 1,
    status: "idle",
    error: null,
  });

  // ── Fetch the next TMDB API page and merge into cache ─────────────────────
  const fetchNextApiPage = useCallback(
    async (
      currentCache: Movie[],
      nextApiPage: number,
      targetUiPage: number,
      query?: string
    ) => {
      setState((s) => ({ ...s, status: "loading", error: null }));

      try {
        const data = query
          ? await searchMovies(query, nextApiPage)
          : await getPopularMovies(nextApiPage);

        const merged = [...currentCache, ...data.results];
        const total = data.total_results;
        const totalUiPages = Math.ceil(total / ITEMS_PER_UI_PAGE);

        setState({
          cache: merged,
          apiPage: nextApiPage,
          uiPage: targetUiPage,
          totalResults: total,
          totalUiPages,
          status: "success",
          error: null,
        });
      } catch (err) {
        setState((s) => ({
          ...s,
          status: "error",
          error: err instanceof Error ? err.message : "Failed to fetch movies",
        }));
      }
    },
    []
  );

  // ── Advance to the next UI page ───────────────────────────────────────────
  const goToNextPage = useCallback(() => {
    if (state.status === "loading") return;

    const nextUiPage = state.uiPage + 1;
    if (nextUiPage > state.totalUiPages) return;

    const needed = nextUiPage * ITEMS_PER_UI_PAGE;

    if (state.cache.length >= needed) {
      // Already have enough cached — instant render
      setState((s) => ({ ...s, uiPage: nextUiPage }));
      return;
    }

    // Need more data — fetch next TMDB page in background
    const nextApiPage = state.apiPage + 1;
    fetchNextApiPage(state.cache, nextApiPage, nextUiPage, queryRef.current);
  }, [state, fetchNextApiPage]);

  // ── Go back to the previous UI page (always instant) ─────────────────────
  const goToPrevPage = useCallback(() => {
    setState((s) => {
      if (s.uiPage <= 1) return s;
      return { ...s, uiPage: s.uiPage - 1 };
    });
  }, []);

  // ── Reset: start fresh (new query or re-init browse) ─────────────────────
  const reset = useCallback(
    (query?: string) => {
      queryRef.current = query;
      setState({
        cache: [],
        apiPage: 0,
        uiPage: 1,
        totalResults: 0,
        totalUiPages: 1,
        status: "idle",
        error: null,
      });
      fetchNextApiPage([], 1, 1, query);
    },
    [fetchNextApiPage]
  );

  // ── Derive the current 12-item slice from cache ───────────────────────────
  const start = (state.uiPage - 1) * ITEMS_PER_UI_PAGE;
  const end = state.uiPage * ITEMS_PER_UI_PAGE;
  const currentMovies = state.cache.slice(start, end);

  return {
    ...state,
    currentMovies,
    goToNextPage,
    goToPrevPage,
    reset,
  };
}
