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
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-page py-7 text-center">
      <h2 className="mb-3 text-2xl font-extrabold text-text-primary">
        Algo salió mal
      </h2>
      <p className="mb-5 max-w-[400px] text-base text-text-secondary">
        {error.message || "Ocurrió un error inesperado. Probá de nuevo."}
      </p>
      <button
        type="button"
        onClick={reset}
        aria-label="Reintentar"
        className="cursor-pointer rounded-sm border-none bg-accent px-5 py-3 text-base font-bold text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
