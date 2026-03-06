# ✈️ Vuelos para papás

Comparador de rutas multi-tramo **Venezuela → Caracas (CCS) → Toronto (YYZ)**.  
Los datos persisten en la nube vía **Vercel KV** (o Redis) — podés volver en cualquier momento.

---

## 📋 Paso a paso: levantar el proyecto

### 1. Clonar o entrar al proyecto

```bash
cd vuelos-papas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

- Copiá el archivo de ejemplo:
  ```bash
  cp .env.local.example .env.local
  ```
- Editá `.env.local` y completá las variables. Para **desarrollo local con Vercel KV** necesitás:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN` (opcional)

  Esas variables las obtenés desde [Vercel](https://vercel.com) → tu proyecto → **Storage** → tu base KV → **.env**.

  Si **no tenés KV** (solo querés probar la UI), podés dejar el archivo vacío o con valores dummy: la app cargará datos por defecto y al guardar fallará; útil solo para ver la interfaz.

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

- Abrí el navegador en **http://localhost:3000**.
- La página principal redirige a **Opciones**; los datos se cargan desde la API (y esta desde KV si está configurado).

### 5. Build para producción (opcional)

```bash
npm run build
npm start
```

- `npm start` sirve la app en el puerto 3000 en modo producción.

---

## 🚀 Deploy en Vercel

### 1. Subir el código a GitHub

```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/TU_USUARIO/vuelos-papas.git
git push -u origin main
```

### 2. Crear proyecto en Vercel

1. Entrá a [vercel.com](https://vercel.com) → **Add New Project** → importá el repo.
2. **Storage** → **Create Database** → elegí **KV** (o Redis si KV está deprecado) → nombre: `vuelos-data`.
3. Conectá la base al proyecto para que Vercel inyecte las variables de entorno.
4. **Deploy**.

### 3. Probar en producción

- La URL que te da Vercel ya usa las variables de Storage; no hace falta configurar nada más.

---

## Concepto clave: rutas con tramos

Cada ruta puede tener **N tramos** independientes, cada uno con su precio:

- Tramo 1: CCS → CUN (precio agencia X)
- Tramo 2: CUN → YYZ (precio aerolínea Y)
- Tramo 3: (si hay más escala)

El **total de la ruta** = suma de todos los tramos + trayecto nacional (opcional).  
Cada ruta puede asociar **un trayecto nacional** (ej. bus a CCS) desde el selector en el formulario.

Por tramo podés cargar **fecha de vuelo**, **hora de salida** y **hora de llegada**; si ingresás salida y llegada, las **horas de vuelo** se calculan solas.

---

## 📁 Estructura del proyecto

```
app/
  api/
    data/route.ts         # GET/POST configuración (prioridad, moneda, tasa USD/CAD)
    flights/route.ts      # POST/DELETE rutas internacionales
    domestic/route.ts     # POST/DELETE trayectos nacionales
  layout.tsx
  page.tsx                # redirige a /opciones
  opciones/page.tsx       # página principal (carga datos y FlightApp)
  opciones/loading.tsx    # estado de carga
  opciones/error.tsx      # error boundary de la página Opciones
  buscar/page.tsx         # buscador Google Flights
  error.tsx               # error boundary global
components/
  FlightApp.tsx           # orquestador (estado, ranking, persistencia)
  ConfigBar.tsx           # prioridad, moneda, tasa de cambio
  DomesticForm.tsx        # trayectos nacionales (sección colapsable)
  RouteForm.tsx           # formulario por ruta (tramos + guardar)
  RouteCard.tsx           # tarjeta en el ranking
  LegEditor.tsx           # editor de un tramo (origen, destino, aerolínea, fecha, horas, precio)
  Header.tsx              # navegación Opciones / Buscar vuelos
  GoogleFlightsSearch.tsx # enlace a Google Flights con origen/destino/fechas
  ui/                     # CurrencyToggle, Pill, InputField, SelectField, ScoreBadge, SaveNotification
hooks/
  useFlightApp.ts         # useRoutes, useDomestics, useScoredRoutes, usePersist
lib/
  kv.ts                   # helpers Vercel KV + normalización de datos
  types.ts                # Route, Leg, Domestic, AppData, Priority
  flightUtils.ts          # toCAD, fmt, emptyLeg, emptyRoute, flightHoursFromTimes, scoring
  validations.ts          # esquemas Zod para las APIs
```

---

## 💡 Uso

1. **Trayecto nacional**: agregá cómo llegan a CCS (bus, carro, vuelo interno). La sección se puede colapsar (▲ Ocultar / ▼ Mostrar).
2. **Rutas**: agregá cada combinación que encontrés, con sus tramos, fechas/horas y precios.
3. En cada ruta elegí **qué trayecto nacional** aplica (selector “Trayecto nacional para esta ruta”).
4. **Tasa USD/CAD**: en la barra superior podés cambiar la tasa (ej. 1.39); se guarda automáticamente.
5. **💾 Guardar** cada ruta y cada trayecto nacional para que persistan en la nube. El estado (Guardando… / Guardado / Error) se muestra como notificación en la esquina superior derecha e indica qué se guardó (ruta, trayecto nacional o configuración).
6. El **ranking** se calcula según la prioridad elegida (Precio, Comodidad, Tiempo, Balance).

---

## 🔧 Comandos útiles

| Comando            | Descripción                        |
|--------------------|------------------------------------|
| `npm run dev`      | Servidor de desarrollo (hot reload) |
| `npm run build`    | Build de producción                |
| `npm start`        | Servir build en el puerto 3000     |
| `npm run lint`     | Ejecutar ESLint                    |
| `npm run format`   | Formatear código con Prettier      |
| `npm run format:check` | Comprobar formato (sin escribir) |
| `npm run test`     | Ejecutar tests (Vitest)            |
| `npm run test:watch` | Tests en modo watch              |
