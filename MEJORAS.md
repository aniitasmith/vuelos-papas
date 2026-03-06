# Análisis de mejoras — Vuelos para papás

Revisión del proyecto (estructura, tipos, API, componentes, UX, rendimiento y mantenibilidad).

---

## 1. Código muerto y limpieza

### 1.1 Componente `SaveStatus` sin uso
- **Ubicación:** `components/ui/SaveStatus.tsx`
- **Problema:** Se reemplazó por `SaveNotification` (notificación en esquina). Ya no se importa en ningún sitio.
- **Mejora:** Eliminar `SaveStatus.tsx` o documentar que queda como alternativa si se quiere mostrar el estado dentro de un componente.

### 1.2 Normalización de `priority` al cargar datos
- **Ubicación:** `lib/kv.ts` — `getData()`
- **Problema:** Si en KV hay un valor inválido (ej. typo o dato antiguo), `priority` puede no ser uno de `"price" | "comfort" | "time" | "balanced"`. El código usa `WEIGHTS[priority] ?? WEIGHTS.price`, así que no rompe, pero el tipo en runtime puede ser incorrecto.
- **Mejora:** En `getData()`, normalizar:
  ```ts
  const VALID_PRIORITIES: Priority[] = ["price", "comfort", "time", "balanced"];
  if (merged.priority && !VALID_PRIORITIES.includes(merged.priority as Priority)) {
    merged.priority = "price";
  }
  ```

---

## 2. Robustez y validación

### 2.1 Legs sin `date` / `time` / `timeArrival` al cargar desde KV
- **Ubicación:** Datos guardados antes de añadir esos campos.
- **Problema:** Al editar un tramo antiguo, `leg.date`, `leg.time`, `leg.timeArrival` pueden ser `undefined`. El UI ya usa `?? ""`; la API usa Zod con `.optional().default("")`, así que está cubierto.
- **Estado:** OK; opcionalmente en `getData()` se podría normalizar cada `leg` con `date: leg.date ?? ""`, etc., para unificar el modelo en cliente.

### 2.2 Validación de fechas y horas en el cliente
- **Ubicación:** `LegEditor` — inputs `date` y `time`.
- **Problema:** No se valida que la hora de llegada sea posterior a la de salida (mismo día) ni que la fecha sea futura si se desea.
- **Mejora (opcional):** Mensaje de advertencia si `timeArrival <= time` en mismo día (vuelo nocturno está soportado por `flightHoursFromTimes`). No bloquear, solo informar.

### 2.3 Límite de rutas o tramos
- **Problema:** No hay límite de rutas ni de tramos por ruta. Con muchos datos, la UI y el payload pueden crecer mucho.
- **Mejora:** Límite razonable (ej. 20 rutas, 10 tramos por ruta) y mensaje claro si se alcanza.

---

## 3. UX y accesibilidad

### 3.1 Notificación superior y header fijo
- **Ubicación:** `SaveNotification` — `top: 72`.
- **Problema:** Si el header cambia de altura (idioma, fuentes, zoom), la notificación puede solaparse.
- **Mejora:** Usar una variable CSS para la altura del header (ej. `--header-height: 72px`) y reutilizarla en el layout y en la notificación.

### 3.2 Focus en formularios
- **Problema:** Al abrir una sección colapsada (p. ej. Trayecto nacional) no se mueve el foco al primer campo.
- **Mejora:** Opcionalmente usar `ref` y `focus()` al expandir, para mejorar accesibilidad y teclado.

### 3.3 Mensaje cuando no hay rutas guardadas
- **Ubicación:** `FlightApp` — mensaje “Completá y guardá al menos una ruta con precio…”.
- **Estado:** Ya está; se podría enlazar “ruta” al primer bloque de rutas o al botón “Agregar otra ruta” para mayor claridad.

### 3.4 Responsive en LegEditor
- **Ubicación:** `LegEditor` — fila Origen → Destino | Aerolínea con `gridTemplateColumns: "1fr auto 1fr minmax(140px, 1fr)"`.
- **Problema:** En pantallas muy estrechas la fila puede quedar muy comprimida.
- **Mejora:** En viewports pequeños (media query) usar 2 filas: Origen → Destino en una, Aerolínea debajo a ancho completo, o permitir wrap con `auto-fit` y `minmax` más pequeño.

---

## 4. API y persistencia

### 4.1 Rate limiting
- **Ubicación:** `app/api/*/route.ts`
- **Problema:** No hay límite de solicitudes; en producción podría abusarse.
- **Mejora:** Añadir rate limiting (p. ej. middleware o Vercel config) por IP o por usuario si hubiera auth.

### 4.2 Idempotencia y concurrencia
- **Ubicación:** `lib/kv.ts` — `getData()` + `saveData()`.
- **Problema:** Dos peticiones que lean, modifiquen y guarden al mismo tiempo pueden pisar cambios (last-write-wins).
- **Mejora:** Para un uso familiar está bien; si crece el uso, valorar transacciones o versionado (ej. `lastUpdated` como condición).

### 4.3 Códigos de error más específicos
- **Ubicación:** Respuestas 400 de las APIs.
- **Problema:** A veces solo se devuelve “Datos inválidos” sin detalle.
- **Estado:** Ya se envía `details: parsed.error.flatten()` en 400; el cliente podría mostrar esos detalles en la notificación de error (p. ej. “Falta el campo X”).

---

## 5. Rendimiento

### 5.1 Re-renders en FlightApp
- **Ubicación:** `FlightApp` — muchos `useState` y callbacks que pasan a hijos.
- **Estado:** Los hooks (`useRoutes`, `useDomestics`, etc.) ya encapsulan estado y callbacks con `useCallback`; el scoring está en `useMemo`. Razonable para el tamaño actual.

### 5.2 Lista larga de RouteCard
- **Problema:** Si hay muchas rutas en el ranking, no hay virtualización.
- **Mejora:** Solo necesario si se esperan muchas rutas (p. ej. >20); entonces considerar virtualización (react-window o similar).

### 5.3 Debounce del guardado de configuración
- **Ubicación:** `FlightApp` — `useEffect` con `setTimeout(..., 600)`.
- **Estado:** 600 ms está bien; evita muchos POST al cambiar prioridad/moneda/tasa.

---

## 6. Testing

### 6.1 Cobertura actual
- **Ubicación:** `lib/__tests__/` — tests de `flightUtils` y `validations`.
- **Falta:** Tests para `flightHoursFromTimes` (horas calculadas, vuelo nocturno); ya hay tests de `toCAD`, `fmt`, etc.

### 6.2 Tests de componentes
- **Problema:** No hay tests de React (LegEditor, RouteForm, SaveNotification, etc.).
- **Mejora:** Añadir pruebas con React Testing Library para flujos críticos (añadir tramo, calcular horas, guardar, mostrar notificación).

### 6.3 Tests de API
- **Problema:** No hay tests de las rutas API (POST/DELETE con payloads válidos e inválidos).
- **Mejora:** Tests con mocks de KV o con Vitest + fetch para `/api/flights`, `/api/domestic`, `/api/data`.

---

## 7. Tipado y consistencia

### 7.1 `WEIGHTS` y tipo `Priority`
- **Ubicación:** `lib/flightUtils.ts` — `WEIGHTS: Record<string, ...>`.
- **Mejora:** Tipar como `Record<Priority, { price: number; stops: number; duration: number }>` para que el tipo obligue a tener las cuatro prioridades.

### 7.2 Leg: `date` / `time` / `timeArrival` opcionales
- **Ubicación:** `lib/types.ts`.
- **Estado:** Opcionales por compatibilidad; en el resto del código se usa `?? ""`. Consistente.

---

## 8. Documentación y README

### 8.1 README desactualizado
- **Problema:** No menciona:
  - Hooks (`useRoutes`, `useDomestics`, `useScoredRoutes`, `usePersist`).
  - Notificación de guardado (SaveNotification).
  - Páginas de loading y error (`loading.tsx`, `error.tsx`).
  - Campos por tramo: fecha, hora salida/llegada, cálculo automático de horas.
  - Sección colapsable de Trayecto nacional.
  - Comandos `lint`, `format`, `test`.
- **Mejora:** Actualizar README con la estructura actual y las funcionalidades listadas arriba.

### 8.2 Comentarios en código
- **Estado:** Tipos y funciones clave tienen comentarios (ej. `flightHoursFromTimes`, tipos en `types.ts`). Opcional: comentar la lógica del ranking (normalización, pesos) en `useScoredRoutes`.

---

## 9. Seguridad y buenas prácticas

### 9.1 Variables de entorno
- **Estado:** Uso de `.env.local` y `.env.local.example`; KV no expuesto al cliente. Correcto.

### 9.2 Contenido generado por usuario
- **Problema:** Labels, notas y nombres de rutas se guardan y muestran sin sanitizar.
- **Estado:** Al renderizar con React no se usa `dangerouslySetInnerHTML`; el riesgo XSS es bajo. Si en el futuro se mostrara HTML, habría que sanitizar.

### 9.3 next.config.js
- **Ubicación:** `next.config.js` — vacío.
- **Mejora:** Si se usan dominios externos para imágenes o se quieren cabeceras de seguridad, configurarlos aquí.

---

## 10. Resumen prioritario

| Prioridad | Mejora |
|-----------|--------|
| Alta | Normalizar `priority` en `getData()` para datos antiguos o corruptos. |
| Alta | Actualizar README (hooks, notificación, loading/error, campos de tramo, comandos). |
| Media | Eliminar o documentar `SaveStatus.tsx` (código muerto). |
| Media | Tipar `WEIGHTS` con `Record<Priority, ...>`. |
| Media | Tests para `flightHoursFromTimes` y, si se puede, para APIs y componentes clave. |
| Baja | Variable CSS `--header-height` para la notificación. |
| Baja | Responsive en la fila Origen/Destino/Aerolínea del LegEditor. |
| Baja | Límite máximo de rutas/tramos y mensaje al usuario. |

---

*Documento generado a partir de una revisión del código del proyecto.*
