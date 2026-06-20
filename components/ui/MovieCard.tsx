"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getPosterUrl } from "@/lib/tmdb";
import { formatYear } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import type { Movie } from "@/types/tmdb";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  priority?: boolean;
}

export function MovieCard({ movie, onClick, priority = false }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path, "w500"); // Upgraded to w500 for better quality
  const blurUrl = getPosterUrl(movie.poster_path, "w92");

  return (
    <motion.article
      onClick={() => onClick(movie)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(movie);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.title}`}
      initial="initial"
      whileHover="hover"
      whileFocus="hover"
      variants={{
        initial: { scale: 1, y: 0, boxShadow: "var(--shadow-card)" },
        hover: { scale: 1.05, y: -4, boxShadow: "var(--shadow-card-hover)" },
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--bg-surface)",
        cursor: "pointer",
        aspectRatio: "2 / 3",
        zIndex: 1,
      }}
      className="movie-card"
    >
      {/* Poster image with zoom on hover */}
      <motion.div
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.03 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <Image
          src={posterUrl}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
          priority={priority}
          placeholder={movie.poster_path ? "blur" : undefined}
          blurDataURL={movie.poster_path ? blurUrl : undefined}
        />
      </motion.div>

      {/* Heavy gradient overlay on hover */}
      <motion.div
        variants={{
          initial: { opacity: 0.8 },
          hover: { opacity: 1 },
        }}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top right favorite button (always visible but stronger on hover) */}
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
        <FavoriteButton movie={movie} />
      </div>

      {/* Metadata — slides up and fades in strongly on hover */}
      <motion.div
        variants={{
          initial: { y: 10, opacity: 0.8 },
          hover: { y: 0, opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.2,
          }}
        >
          {movie.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {formatYear(movie.release_date)}
          </p>
          <StarRating rating={movie.vote_average} />
        </div>
      </motion.div>
    </motion.article>
  );
}
