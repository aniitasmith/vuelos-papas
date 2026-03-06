export default function OpcionesLoading() {
  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px var(--page-padding)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: 18,
          fontWeight: "var(--label-weight)",
        }}
      >
        <div
          className="loading-spinner"
          style={{ margin: "0 auto var(--space-lg)" }}
        />
        Cargando opciones…
      </div>
    </div>
  );
}
