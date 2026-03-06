"use client";

export function Pill({
  icon,
  label,
  accent,
  green,
  warn,
  dim,
}: {
  icon: string;
  label: string;
  accent?: boolean;
  green?: boolean;
  warn?: boolean;
  dim?: boolean;
}) {
  return (
    <span
      style={{
        background: green
          ? "var(--success-bg)"
          : warn
            ? "var(--warn-bg)"
            : accent
              ? "#dbeafe"
              : "#f1f5f9",
        border: green
          ? "2px solid var(--success)"
          : warn
            ? "2px solid var(--warn)"
            : accent
              ? "2px solid var(--accent)"
              : "2px solid var(--border)",
        color: dim
          ? "var(--text-muted)"
          : green
            ? "var(--success)"
            : warn
              ? "var(--warn)"
              : accent
                ? "var(--accent)"
                : "var(--text-secondary)",
        borderRadius: 999,
        padding: "6px 14px",
        fontSize: 14,
        fontWeight: 600,
        whiteSpace: "nowrap" as const,
      }}
    >
      {icon} {label}
    </span>
  );
}
