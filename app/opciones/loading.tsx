export default function OpcionesLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-page py-7">
      <div className="text-center text-lg font-semibold text-text-secondary">
        <div className="loading-spinner mx-auto mb-4" />
        Cargando opciones…
      </div>
    </div>
  );
}
