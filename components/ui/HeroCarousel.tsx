"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getTrendingMovies, getBackdropUrl, getPosterUrl } from "@/lib/tmdb";
import { formatYear } from "@/lib/utils";
import type { Movie } from "@/types/tmdb";
import { Star, Info } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";

interface HeroCarouselProps {
  onMovieClick: (movie: Movie) => void;
}

export function HeroCarousel({ onMovieClick }: HeroCarouselProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let mounted = true;
    getTrendingMovies().then((res) => {
      if (mounted) setMovies(res.results.slice(0, 5)); // Use top 5
    }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (movies.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length, isHovered]);

  if (movies.length === 0) return null;

  const movie = movies[currentIndex];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "75vh",
        minHeight: 500,
        maxHeight: 800,
        overflow: "hidden",
        backgroundColor: "var(--bg-base)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          {/* Backdrop Image - Full quality */}
          <Image
            src={getBackdropUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradients to blend into page and left side */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(0deg, var(--bg-base) 0%, transparent 40%)",
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "5%",
          paddingBottom: "8%",
          maxWidth: 1280,
          margin: "0 auto",
          right: 0,
          zIndex: 10,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ maxWidth: 600 }}
          >
            <h1
              className="text-shadow-hero"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              {movie.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 500 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent-gold)" }}>
                <Star fill="currentColor" size={18} />
                {movie.vote_average.toFixed(1)}
              </span>
              <span>•</span>
              <span>{formatYear(movie.release_date)}</span>
            </div>

            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.5,
                color: "var(--text-secondary)",
                marginBottom: 32,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {movie.overview}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={() => onMovieClick(movie)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  borderRadius: "var(--radius-md)",
                  background: "#fff",
                  color: "#000",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <Info size={20} />
                More Info
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <FavoriteButton movie={movie} size={24} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div style={{ position: "absolute", bottom: 32, right: "5%", display: "flex", gap: 8, zIndex: 10 }}>
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: idx === currentIndex ? "#fff" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
