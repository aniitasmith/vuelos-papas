"use client";

export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#00c48c" : score >= 60 ? "#f5a623" : "#e05c5c";
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        borderRadius: "50%",
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier Prime', monospace",
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0,
        boxShadow: `0 0 12px ${color}88`,
      }}
    >
      {score}
    </div>
  );
}
