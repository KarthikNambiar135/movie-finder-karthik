"use client";

import { useState, useEffect } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { SearchBar } from "@/components/ui/SearchBar";
import { Heart, Film } from "lucide-react";
import { motion } from "framer-motion";

interface NavBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onBrandClick: () => void;
  onFavoritesClick: () => void;
}

export function NavBar({ searchQuery, onSearchChange, onBrandClick, onFavoritesClick }: NavBarProps) {
  const { count } = useFavorites();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed", // Changed to fixed to float over hero
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "16px 40px",
        transition: "all var(--transition-smooth)",
        background: scrolled ? "rgba(0,0,0,0.85)" : "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {/* Brand */}
        <div
          role="button"
          tabIndex={0}
          onClick={onBrandClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            outline: "none",
          }}
        >
          <div style={{ color: "var(--accent-red)" }}>
            <Film size={28} strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontSize: "1.375rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.04em",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
            className="hidden-mobile"
          >
            MovieFinder
          </span>
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={() => onSearchChange("")}
        />

        {/* Favorites shortcut */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFavoritesClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-primary)",
            padding: "8px",
            outline: "none",
          }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
            <Heart size={24} color={count > 0 ? "var(--accent-red)" : "currentColor"} fill={count > 0 ? "var(--accent-red)" : "none"} />
            <span className="hidden-mobile" style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Favorites</span>
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: "absolute",
                  top: -8,
                  left: 14,
                  background: "var(--accent-red)",
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  minWidth: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "2px solid var(--bg-base)",
                }}
              >
                {count}
              </motion.span>
            )}
          </div>
        </motion.button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
