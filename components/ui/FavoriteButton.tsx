"use client";

import { useFavorites } from "@/context/FavoritesContext";
import type { Movie } from "@/types/tmdb";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  movie: Movie;
  size?: number;
}

export function FavoriteButton({ movie, size = 18 }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(movie);
      }}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={fav}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size + 16,
        height: size + 16,
        borderRadius: "var(--radius-full)",
        background: fav ? "var(--accent-red-muted)" : "rgba(0,0,0,0.4)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${fav ? "rgba(229,9,20,0.3)" : "rgba(255,255,255,0.15)"}`,
        cursor: "pointer",
        flexShrink: 0,
        outline: "none",
        transition: "background var(--transition-fast), border-color var(--transition-fast)",
      }}
    >
      <motion.div
        animate={{ scale: fav ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Heart
          size={size}
          color={fav ? "var(--accent-red)" : "#fff"}
          fill={fav ? "var(--accent-red)" : "none"}
        />
      </motion.div>
    </motion.button>
  );
}
