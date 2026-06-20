import { motion } from "framer-motion";
import type { Tab } from "@/types/tmdb";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart } from "lucide-react";

interface HomeTabsProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export function HomeTabs({ activeTab, onChange }: HomeTabsProps) {
  const { count } = useFavorites();

  return (
    <div
      role="tablist"
      aria-label="Filter movies"
      style={{
        display: "flex",
        gap: 32,
        borderBottom: "1px solid var(--border)",
        marginBottom: 32,
      }}
    >
      {(["browse", "favorites"] as Tab[]).map((tab) => {
        const isActive = activeTab === tab;
        const isFavorites = tab === "favorites";

        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            style={{
              position: "relative",
              padding: "16px 0",
              background: "none",
              border: "none",
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "1.0625rem",
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "color var(--transition-fast)",
            }}
          >
            {isFavorites && (
              <Heart size={18} fill={isActive ? "currentColor" : "none"} />
            )}
            {isFavorites ? "Favorites" : "All Movies"}

            {isFavorites && count > 0 && (
              <span
                style={{
                  background: isActive ? "var(--accent-red)" : "var(--bg-elevated)",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  transition: "all var(--transition-fast)",
                }}
              >
                {count}
              </span>
            )}

            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: isFavorites ? "var(--accent-red)" : "var(--accent-blue)",
                  borderRadius: "3px 3px 0 0",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
