"use client";

import { motion, type Variants } from "framer-motion";
import { MovieCard } from "@/components/ui/MovieCard";
import type { Movie } from "@/types/tmdb";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  },
};

export function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  // Use a derived key to ensure Framer Motion treats new lists as fresh components,
  // which properly triggers the staggerChildren entry animations again.
  const gridKey = movies.length > 0 ? movies.map(m => m.id).join('-') : 'empty-grid';

  return (
    <motion.div
      key={gridKey}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      role="list"
      aria-label="Movie results"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "24px",
      }}
      className="movie-grid-premium"
    >
      {movies.map((movie, index) => (
        <motion.div key={movie.id} variants={itemVariants} role="listitem">
          <MovieCard
            movie={movie}
            onClick={onMovieClick}
            priority={index < 4}
          />
        </motion.div>
      ))}

      <style>{`
        .movie-grid-premium {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .movie-grid-premium { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .movie-grid-premium { grid-template-columns: repeat(4, 1fr); gap: 32px; }
        }
      `}</style>
    </motion.div>
  );
}
