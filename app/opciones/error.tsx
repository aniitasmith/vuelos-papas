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
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-page py-7 text-center">
      <h2 className="mb-3 text-2xl font-extrabold text-text-primary">
        No se pudieron cargar las opciones
      </h2>
      <p className="mb-5 max-w-[400px] text-base text-text-secondary">
        {error.message || "Revisá tu conexión o intentá más tarde."}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          aria-label="Reintentar cargar opciones"
          className="cursor-pointer rounded-sm border-none bg-accent px-5 py-3 text-base font-bold text-white"
        >
          Reintentar
        </button>
        <Link
          href="/opciones"
          className="rounded-sm border-2 border-accent bg-bg-card px-5 py-3 text-base font-bold text-accent no-underline"
        >
          Ir a inicio
        </Link>
      </div>
    </div>
  );
}
