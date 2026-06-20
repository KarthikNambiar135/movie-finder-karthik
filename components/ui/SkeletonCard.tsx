export function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        aspectRatio: "2 / 3",
        background: "var(--bg-surface)",
      }}
      className="skeleton"
    />
  );
}

export function SkeletonGrid() {
  return (
    <div
      aria-label="Loading movies…"
      aria-busy="true"
      className="movie-grid-premium"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
