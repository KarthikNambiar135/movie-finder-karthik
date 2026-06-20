"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMovieDetail } from "@/hooks/useMovieDetail";
import { getBackdropUrl } from "@/lib/tmdb";
import { formatYear, formatRuntime } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { X, Clock, Calendar } from "lucide-react";
import type { Movie } from "@/types/tmdb";

interface DetailModalProps {
  movieId: number | null;
  onClose: () => void;
}

export function DetailModal({ movieId, onClose }: DetailModalProps) {
  const { movie, status, error } = useMovieDetail(movieId);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!movieId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [movieId, onClose]);

  useEffect(() => {
    if (!movieId) return;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [movieId]);

  return (
    <>
      <AnimatePresence>
        {movieId && (
          <div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2vw",
            }}
          >
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            />

            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 960,
                maxHeight: "90vh",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-modal)",
                display: "flex",
                flexDirection: "column",
                outline: "none",
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  zIndex: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-full)",
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(12px)",
                  color: "var(--text-primary)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
              >
                <X size={20} />
              </button>

              {status === "loading" && (
                <div style={{ padding: "100px 0", textAlign: "center", color: "var(--text-secondary)" }}>
                  Loading details...
                </div>
              )}

              {status === "error" && (
                <div style={{ padding: "100px 0", textAlign: "center", color: "var(--accent-red)" }}>
                  {error || "Failed to load movie details."}
                </div>
              )}

              {status === "success" && movie && (
                <div className="no-scrollbar" style={{ overflowY: "auto", height: "100%" }}>
                  {/* Massive Cinematic Header */}
                  <div style={{ position: "relative", width: "100%", height: "50vh", minHeight: 300, maxHeight: 500 }}>
                    <Image
                      src={getBackdropUrl(movie.backdrop_path, "w1280")}
                      alt=""
                      fill
                      style={{ objectFit: "cover", objectPosition: "top center" }}
                      priority
                    />
                    {/* Heavy Bottom-to-Top Gradient */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, var(--bg-surface) 0%, rgba(20,20,20,0.6) 40%, transparent 100%)",
                    }} />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to right, var(--bg-surface) 0%, transparent 50%)",
                    }} />

                    {/* Header Content placed over gradient */}
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      padding: "40px",
                      width: "100%",
                      maxWidth: 700,
                    }}>
                      <h2 id="modal-title" className="text-shadow-hero" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        {movie.title}
                      </h2>
                      
                      {movie.tagline && (
                        <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", fontStyle: "italic", marginBottom: 20, opacity: 0.9 }}>
                          "{movie.tagline}"
                        </p>
                      )}

                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, fontSize: "1rem", color: "var(--text-primary)", fontWeight: 500 }}>
                        <StarRating rating={movie.vote_average} />
                        <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.8 }}>
                          <Calendar size={16} />
                          {formatYear(movie.release_date)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.8 }}>
                          <Clock size={16} />
                          {formatRuntime(movie.runtime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: "0 40px 40px", display: "grid", gridTemplateColumns: "1fr", gap: 40 }} className="md-grid-cols-layout">
                    <div>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>Overview</h3>
                      <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "var(--text-secondary)", opacity: 0.9 }}>
                        {movie.overview || "No overview available."}
                      </p>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                      {/* Action Bar */}
                      <div style={{ padding: "20px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
                        <FavoriteButton movie={movie as unknown as Movie} size={24} />
                        <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          Save to Favorites
                        </span>
                      </div>

                      {/* Genres */}
                      <div>
                        <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Genres</h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {movie.genres.map(g => (
                            <span key={g.id} style={{ padding: "6px 12px", borderRadius: "var(--radius-full)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                              {g.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .md-grid-cols-layout { grid-template-columns: 2fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
