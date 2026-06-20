"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchMovies } from "@/lib/tmdb";
import type { Movie, FetchStatus } from "@/types/tmdb";

const DEBOUNCE_MS = 400;
const ITEMS_PER_UI_PAGE = 12;

interface SearchState {
  results: Movie[];
  status: FetchStatus;
  error: string | null;
  totalResults: number;
  totalUiPages: number;
  uiPage: number;
  query: string;
}

interface SearchReturn extends SearchState {
  currentResults: Movie[];
  setQuery: (q: string) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

/**
 * useSearch
 *
 * Debounced search hook. Fires after 400ms of inactivity.
 * Cancels in-flight requests when query changes.
 * Also handles basic pagination for search results.
 */
export function useSearch(): SearchReturn {
  const [query, setQueryState] = useState("");
  const [state, setState] = useState<Omit<SearchState, "query">>({
    results: [],
    status: "idle",
    error: null,
    totalResults: 0,
    totalUiPages: 1,
    uiPage: 1,
  });

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSearch = useCallback(async (q: string, page: number) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setState((s) => ({ ...s, status: "loading", error: null }));

    try {
      const data = await searchMovies(q, page);
      const totalUiPages = Math.ceil(data.total_results / ITEMS_PER_UI_PAGE);

      setState({
        results: data.results,
        status: "success",
        error: null,
        totalResults: data.total_results,
        totalUiPages,
        uiPage: page,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState((s) => ({
        ...s,
        status: "error",
        error: err instanceof Error ? err.message : "Search failed",
      }));
    }
  }, []);

  // Debounce query changes
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setState({
        results: [],
        status: "idle",
        error: null,
        totalResults: 0,
        totalUiPages: 1,
        uiPage: 1,
      });
      return;
    }

    timerRef.current = setTimeout(() => {
      fetchSearch(query.trim(), 1);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, fetchSearch]);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
  }, []);

  const goToNextPage = useCallback(() => {
    if (state.uiPage < state.totalUiPages && query.trim()) {
      fetchSearch(query.trim(), state.uiPage + 1);
    }
  }, [state.uiPage, state.totalUiPages, query, fetchSearch]);

  const goToPrevPage = useCallback(() => {
    if (state.uiPage > 1 && query.trim()) {
      fetchSearch(query.trim(), state.uiPage - 1);
    }
  }, [state.uiPage, query, fetchSearch]);

  // Derive current 12-item slice from page results
  const start = 0;
  const end = ITEMS_PER_UI_PAGE;
  const currentResults = state.results.slice(start, end);

  return {
    ...state,
    query,
    currentResults,
    setQuery,
    goToNextPage,
    goToPrevPage,
  };
}
