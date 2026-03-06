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
    pending: "", // no se muestra; solo saving/saved/error
    saving: `Guardando ${label.toLowerCase()}...`,
    saved: `${label} ${savedVerb}`,
    error: errorMessage || `Error al guardar ${label.toLowerCase()}`,
  };

  const styles: Record<Exclude<Status, "idle">, { bg: string; border: string; color: string; icon: string }> = {
    pending: { bg: "", border: "", color: "", icon: "" },
    saving: {
      bg: "var(--warn-bg)",
      border: "var(--warn)",
      color: "var(--warn)",
      icon: "💾",
    },
    saved: {
      bg: "var(--success-bg)",
      border: "var(--success)",
      color: "var(--success)",
      icon: "✓",
    },
    error: {
      bg: "var(--error-bg)",
      border: "var(--error)",
      color: "var(--error)",
      icon: "✕",
    },
  };

  const { bg, border, color, icon } = styles[status];
  const text = messages[status];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        top: "var(--header-height)",
        right: "var(--page-padding)",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <div
        className="save-notification-enter glass"
        style={{
          padding: "var(--space-sm) var(--space-md)",
          background: bg,
          border: `2px solid ${border}`,
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          fontSize: 13,
          fontWeight: 600,
          color,
          maxWidth: 280,
        }}
      >
        <span style={{ fontSize: 14 }} aria-hidden>
          {icon}
        </span>
        <span>{text}</span>
      </div>
    </div>
  );
}
