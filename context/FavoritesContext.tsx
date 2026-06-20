"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Movie } from "@/types/tmdb";

const STORAGE_KEY = "movie-finder-favorites";

interface FavoritesContextValue {
  favorites: Movie[];
  isFavorite: (id: number) => boolean;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (movie: Movie) => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored) as Movie[]);
      }
    } catch {
      // localStorage unavailable or corrupted — start fresh
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever favorites change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // quota exceeded — silently ignore
    }
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites]
  );

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within <FavoritesProvider>");
  }
  return ctx;
}
