"use client";

import { motion } from "framer-motion";
import { SearchX, Film, AlertTriangle } from "lucide-react";

type EmptyStateType = "search" | "favorites" | "error";

interface EmptyStateProps {
  type: EmptyStateType;
  query?: string;
  onRetry?: () => void;
  onBrowse?: () => void;
}

export function EmptyState({ type, query, onRetry, onBrowse }: EmptyStateProps) {
  const configs = {
    search: {
      icon: <SearchX size={48} strokeWidth={1.5} color="var(--text-muted)" />,
      title: `No results for "${query}"`,
      subtitle: "Try adjusting your search or filtering options.",
      action: null,
    },
    favorites: {
      icon: <Film size={48} strokeWidth={1.5} color="var(--text-muted)" />,
      title: "Your watchlist is empty",
      subtitle: "Start exploring and add movies you want to watch later.",
      action: onBrowse ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBrowse}
          style={{
            marginTop: 24,
            padding: "14px 32px",
            borderRadius: "var(--radius-full)",
            background: "#fff",
            color: "#000",
            border: "none",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Explore Movies
        </motion.button>
      ) : null,
    },
    error: {
      icon: <AlertTriangle size={48} strokeWidth={1.5} color="var(--accent-red)" />,
      title: "Something went wrong",
      subtitle: "We couldn't connect to TMDB. Please check your connection.",
      action: onRetry ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          style={{
            marginTop: 24,
            padding: "14px 32px",
            borderRadius: "var(--radius-full)",
            background: "rgba(255,255,255,0.1)",
            color: "var(--text-primary)",
            border: "1px solid rgba(255,255,255,0.2)",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Try Again
        </motion.button>
      ) : null,
    },
  };

  const { icon, title, subtitle, action } = configs[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px",
        textAlign: "center",
        gap: 16,
      }}
    >
      <div style={{ marginBottom: 8, opacity: 0.8 }}>{icon}</div>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", maxWidth: 360, opacity: 0.8 }}>
        {subtitle}
      </p>
      {action}
    </motion.div>
  );
}
