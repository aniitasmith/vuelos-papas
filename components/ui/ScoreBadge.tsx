"use client";

export function ScoreBadge({ score }: { score: number }) {
  const colorClass =
    score >= 80 ? "bg-success" : score >= 60 ? "bg-warn" : "bg-error";
  return (
    <div
      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-xl font-extrabold text-white ${colorClass}`}
    >
      {score}
    </div>
  );
}
