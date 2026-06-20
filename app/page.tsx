"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { HomeTabs } from "@/components/ui/HomeTabs";
import { MovieGrid } from "@/components/ui/MovieGrid";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { DetailModal } from "@/components/ui/DetailModal";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { HeroCarousel } from "@/components/ui/HeroCarousel";

import { useMoviesManager } from "@/hooks/useMoviesManager";
import { useSearch } from "@/hooks/useSearch";
import { useFavorites } from "@/context/FavoritesContext";
import type { Tab, Movie } from "@/types/tmdb";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // 1. Core Browse State (Buffer Cache Hook)
  const {
    currentMovies: browseMovies,
    uiPage: browseUiPage,
    totalUiPages: browseTotalUiPages,
    status: browseStatus,
    error: browseError,
    goToNextPage: browseNextPage,
    goToPrevPage: browsePrevPage,
    reset: browseReset,
  } = useMoviesManager();

  // 2. Search State (Debounced)
  const {
    query: searchQuery,
    currentResults: searchMovies,
    uiPage: searchUiPage,
    totalUiPages: searchTotalUiPages,
    status: searchStatus,
    error: searchError,
    setQuery: setSearchQuery,
    goToNextPage: searchNextPage,
    goToPrevPage: searchPrevPage,
  } = useSearch();

  // 3. Favorites State
  const { favorites } = useFavorites();

  useEffect(() => {
    browseReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSearching = searchQuery.trim().length > 0;

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
  };

  const handleTabChange = (tab: Tab) => {
    setSearchQuery("");
    setActiveTab(tab);
  };

  const renderContent = () => {
    // Mode A: Searching
    if (isSearching) {
      if (searchStatus === "loading" && searchMovies.length === 0) {
        return <SkeletonGrid />;
      }
      if (searchStatus === "error") {
        return <EmptyState type="error" onRetry={() => setSearchQuery(searchQuery)} />;
      }
      if (searchStatus === "success" && searchMovies.length === 0) {
        return <EmptyState type="search" query={searchQuery} onRetry={() => setSearchQuery("")} />;
      }

      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Search Results for &quot;{searchQuery}&quot;
            </h2>
          </div>
          <MovieGrid movies={searchMovies} onMovieClick={handleMovieClick} />
          {searchTotalUiPages > 1 && (
            <Pagination
              uiPage={searchUiPage}
              totalUiPages={searchTotalUiPages}
              isLoading={searchStatus === "loading"}
              onPrev={searchPrevPage}
              onNext={searchNextPage}
            />
          )}
        </motion.div>
      );
    }

    // Mode B: Favorites Tab
    if (activeTab === "favorites") {
      if (favorites.length === 0) {
        return <EmptyState type="favorites" onBrowse={() => setActiveTab("browse")} />;
      }

      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <MovieGrid movies={favorites} onMovieClick={handleMovieClick} />
        </motion.div>
      );
    }

    // Mode C: Default Browse (Popular Movies)
    if (browseStatus === "loading" && browseMovies.length === 0) {
      return <SkeletonGrid />;
    }
    if (browseStatus === "error") {
      return <EmptyState type="error" onRetry={() => browseReset()} />;
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <MovieGrid movies={browseMovies} onMovieClick={handleMovieClick} />
        {browseTotalUiPages > 0 && (
          <Pagination
            uiPage={browseUiPage}
            totalUiPages={browseTotalUiPages}
            isLoading={browseStatus === "loading"}
            onPrev={browsePrevPage}
            onNext={browseNextPage}
          />
        )}
      </motion.div>
    );
  };

  return (
    <>
      {/* Splash Screen renders exclusively until it signals completion */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Main UI mounts only after splash completes to prevent ANY overlap or partial visibility */}
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <NavBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBrandClick={() => {
              setSearchQuery("");
              setActiveTab("browse");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onFavoritesClick={() => {
              setSearchQuery("");
              setActiveTab("favorites");
              const mainElement = document.getElementById("main-content-area");
              if (mainElement) {
                // Scroll to the tabs/grid section, offset by header height
                const y = mainElement.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}
          />

          {/* Hero Section - Persistent unless searching. Creates a stable layout above tabs. */}
          {!isSearching && (
            <HeroCarousel onMovieClick={handleMovieClick} />
          )}

          {/* Adjust top padding if Hero is missing */}
          <main
            id="main-content-area"
            style={{
              flex: 1,
              padding: isSearching ? "120px 40px 60px" : "40px",
              maxWidth: 1280,
              margin: "0 auto",
              width: "100%",
              position: "relative",
              zIndex: 10,
            }}
          >
            {!isSearching && (
              <HomeTabs activeTab={activeTab} onChange={handleTabChange} />
            )}

            {renderContent()}
          </main>

          <DetailModal
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
          />
        </motion.div>
      )}
    </>
  );
}
