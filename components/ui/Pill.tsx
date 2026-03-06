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
        background: green ? "#0d2e1f" : warn ? "#2e1f0d" : accent ? "#1a2d3a" : "#141e2b",
        border: green
          ? "1px solid #00c48c44"
          : warn
            ? "1px solid #f5a62344"
            : accent
              ? "1px solid #4a7a9b44"
              : "1px solid #1e2d3d",
        color: dim ? "#4a6a5a" : green ? "#00c48c" : warn ? "#f5a623" : accent ? "#7abcd6" : "#9ab",
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 11,
        fontFamily: "'Courier Prime', monospace",
        whiteSpace: "nowrap" as const,
      }}
    >
      {icon} {label}
    </span>
  );
}
