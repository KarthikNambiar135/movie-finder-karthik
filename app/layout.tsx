import type { Metadata } from "next";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "MovieFinder — Discover & Save Favorites",
  description: "Browse popular movies, search the TMDB catalog, and save your favorites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <FavoritesProvider>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100dvh",
            }}
          >
            {children}
            <Footer />
          </div>
        </FavoritesProvider>
      </body>
    </html>
  );
}
