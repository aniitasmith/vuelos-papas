"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px var(--page-padding)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "var(--text-primary)",
          fontSize: 24,
          fontWeight: 800,
          marginBottom: "var(--space-md)",
        }}
      >
        Algo salió mal
      </h2>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: 16,
          marginBottom: "var(--space-xl)",
          maxWidth: 400,
        }}
      >
        {error.message || "Ocurrió un error inesperado. Probá de nuevo."}
      </p>
      <button
        type="button"
        onClick={reset}
        aria-label="Reintentar"
        style={{
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "var(--btn-padding-y) var(--btn-padding-x)",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
