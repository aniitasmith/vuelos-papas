"use client";

type Status = "idle" | "pending" | "saving" | "saved" | "error";
export type SaveContext = "route" | "domestic" | "config";

const CONTEXT_LABELS: Record<SaveContext, string> = {
  route: "Ruta",
  domestic: "Trayecto nacional",
  config: "Configuración",
};

export function SaveNotification({
  status,
  errorMessage,
  context,
}: {
  status: Status;
  errorMessage?: string | null;
  context?: SaveContext | null;
}) {
  if (status === "idle" || status === "pending") return null;

  const label = context ? CONTEXT_LABELS[context] : "Datos";
  const savedVerb =
    !context ? "guardados" : context === "domestic" ? "guardado" : "guardada";

  const messages: Record<Exclude<Status, "idle">, string> = {
    pending: "",
    saving: `Guardando ${label.toLowerCase()}...`,
    saved: `${label} ${savedVerb}`,
    error: errorMessage || `Error al guardar ${label.toLowerCase()}`,
  };

  const styleMap: Record<"saving" | "saved" | "error", string> = {
    saving: "bg-warn-bg border-warn text-warn",
    saved: "bg-success-bg border-success text-success",
    error: "bg-error-bg border-error text-error",
  };
  const icons: Record<Exclude<Status, "idle">, string> = {
    pending: "",
    saving: "💾",
    saved: "✓",
    error: "✕",
  };

  const text = messages[status];
  const icon = icons[status];
  const styleClass = status === "saving" || status === "saved" || status === "error" ? styleMap[status] : "";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed right-[var(--page-padding)] top-[var(--header-height)] z-[1000] pointer-events-none"
    >
      <div
        className={`save-notification-enter glass flex max-w-[280px] items-center gap-2 rounded-sm border-2 p-2 px-4 text-[13px] font-semibold shadow-card ${styleClass}`}
      >
        <span className="text-sm" aria-hidden>
          {icon}
        </span>
        <span>{text}</span>
      </div>
    </div>
  );
}
