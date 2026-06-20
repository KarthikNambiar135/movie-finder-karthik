import { formatRating } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({ rating, className = "" }: StarRatingProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "var(--radius-full)",
        padding: "3px 8px",
        fontSize: "0.7rem",
        fontWeight: 600,
        color: "var(--text-primary)",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="#F5C518"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {formatRating(rating)}
    </span>
  );
}
