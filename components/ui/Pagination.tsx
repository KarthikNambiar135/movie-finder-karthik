interface PaginationProps {
  uiPage: number;
  totalUiPages: number;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({
  uiPage,
  totalUiPages,
  isLoading,
  onPrev,
  onNext,
}: PaginationProps) {
  const isPrevDisabled = uiPage <= 1 || isLoading;
  const isNextDisabled = uiPage >= totalUiPages || isLoading;

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border)",
    background: "var(--bg-surface)",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    fontFamily: "inherit",
  };

  const btnDisabled: React.CSSProperties = {
    opacity: 0.35,
    cursor: "not-allowed",
    pointerEvents: "none",
  };

  const btnActive: React.CSSProperties = {
    background: "var(--bg-elevated)",
    borderColor: "var(--border-hover)",
  };

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        marginTop: 48,
        paddingBottom: 16,
      }}
    >
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        aria-label="Previous page"
        aria-disabled={isPrevDisabled}
        style={{
          ...btnBase,
          ...(isPrevDisabled ? btnDisabled : btnActive),
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Prev
      </button>

      <span
        aria-live="polite"
        aria-atomic="true"
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          minWidth: 120,
          textAlign: "center",
        }}
      >
        {isLoading ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Spinner />
            Loading…
          </span>
        ) : (
          `Page ${uiPage} of ${totalUiPages}`
        )}
      </span>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        aria-label="Next page"
        aria-disabled={isNextDisabled}
        style={{
          ...btnBase,
          ...(isNextDisabled ? btnDisabled : btnActive),
        }}
      >
        Next
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
      style={{ animation: "spin 0.75s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
