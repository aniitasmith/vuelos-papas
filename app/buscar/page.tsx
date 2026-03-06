import { GoogleFlightsSearch } from "@/components/GoogleFlightsSearch";

export default function BuscarPage() {
  return (
    <div style={{ padding: "28px var(--page-padding)", width: "100%", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <div style={{ fontSize: 16, color: "var(--accent)", fontWeight: "var(--section-title-weight)", marginBottom: "var(--space-sm)" }}>
            Buscador de vuelos
          </div>
          <h1 style={{ fontSize: 32, margin: 0, color: "var(--text-primary)", fontWeight: 800 }}>
            🔍 Buscar en Google Flights
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-md)", fontSize: 18, fontWeight: "var(--label-weight)" }}>
            Elegí origen, destino y fechas. Se abre en una pestaña nueva.
          </p>
        </div>
        <GoogleFlightsSearch />
      </div>
    </div>
  );
}
