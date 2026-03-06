"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function OpcionesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Opciones page error:", error);
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
        No se pudieron cargar las opciones
      </h2>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: 16,
          marginBottom: "var(--space-xl)",
          maxWidth: 400,
        }}
      >
        {error.message || "Revisá tu conexión o intentá más tarde."}
      </p>
      <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={reset}
          aria-label="Reintentar cargar opciones"
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
        <Link
          href="/opciones"
          style={{
            background: "var(--bg-card)",
            color: "var(--accent)",
            border: "2px solid var(--accent)",
            borderRadius: "var(--radius-sm)",
            padding: "var(--btn-padding-y) var(--btn-padding-x)",
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Ir a inicio
        </Link>
      </div>
    </div>
  );
}
