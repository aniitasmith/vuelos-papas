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
  const base = "rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap border-2";
  const variant = green
    ? "border-success bg-success-bg text-success"
    : warn
      ? "border-warn bg-warn-bg text-warn"
      : accent
        ? "border-accent bg-blue-100 text-accent"
        : dim
          ? "border-border bg-slate-100 text-text-muted"
          : "border-border bg-slate-100 text-text-secondary";

  return (
    <span className={`${base} ${variant}`}>
      {icon} {label}
    </span>
  );
}
