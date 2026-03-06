"use client";

export function SaveStatus({
  status,
  errorMessage,
}: {
  status: "idle" | "saving" | "saved" | "error";
  errorMessage?: string | null;
}) {
  const map: Record<string, [string, string] | null> = {
    idle: null,
    saving: ["#f5a623", "💾 Guardando..."],
    saved: ["#00c48c", "✓ Guardado"],
    error: ["#e05c5c", errorMessage || "✕ Error"],
  };
  const val = map[status];
  if (!val) return null;
  return (
    <span
      style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: 12,
        color: val[0],
        maxWidth: 220,
        display: "inline-block",
      }}
      title={errorMessage || undefined}
    >
      {val[1]}
    </span>
  );
}
