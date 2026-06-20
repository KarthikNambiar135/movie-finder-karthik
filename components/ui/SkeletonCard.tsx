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
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
      }}
      className="movie-grid"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
