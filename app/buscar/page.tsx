import { GoogleFlightsSearch } from "@/components/GoogleFlightsSearch";

export default function BuscarPage() {
  return (
    <div className="w-full box-border px-page py-7">
      <div className="mx-auto w-full max-w-content">
        <div className="mb-6 text-center">
          <div className="mb-2 text-base font-bold text-accent">
            Buscador de vuelos
          </div>
          <h1 className="m-0 text-3xl font-extrabold text-text-primary">
            🔍 Buscar en Google Flights
          </h1>
          <p className="mt-3 text-lg font-semibold text-text-secondary">
            Elegí origen, destino y fechas. Se abre en una pestaña nueva.
          </p>
        </div>
        <GoogleFlightsSearch />
      </div>
    </div>
  );
}
