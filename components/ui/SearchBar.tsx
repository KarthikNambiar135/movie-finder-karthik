"use client";

import { useRef, type ChangeEvent, type FormEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      style={{ flex: 1, maxWidth: 480, position: "relative" }}
    >
      <Search
        size={18}
        color="var(--text-muted)"
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />

      <input
        ref={inputRef}
        type="search"
        placeholder="Search titles, actors, directors..."
        value={value}
        onChange={handleChange}
        autoComplete="off"
        spellCheck={false}
        style={{
          width: "100%",
          padding: "12px 40px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "var(--radius-full)",
          color: "var(--text-primary)",
          fontSize: "0.9375rem",
          outline: "none",
          transition: "all var(--transition-fast)",
          backdropFilter: "blur(12px)",
        }}
        onFocus={(e) => {
          e.target.style.background = "rgba(255,255,255,0.12)";
          e.target.style.borderColor = "rgba(255,255,255,0.3)";
        }}
        onBlur={(e) => {
          if (!value) {
            e.target.style.background = "rgba(255,255,255,0.08)";
            e.target.style.borderColor = "rgba(255,255,255,0.1)";
          }
        }}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "50%",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
