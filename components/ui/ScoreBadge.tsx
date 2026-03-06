"use client";

export function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "var(--success)" : score >= 60 ? "var(--warn)" : "var(--error)";
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        borderRadius: "50%",
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 20,
        flexShrink: 0,
      }}
    >
      {score}
    </div>
  );
}
