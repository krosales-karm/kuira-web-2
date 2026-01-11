# Página de Detalles de Película - `/convocatoria/[id]`

## Descripción
Página individual que muestra todos los detalles de una película enviada a la convocatoria, incluyendo el reproductor de video y la información del realizador.

## Archivos Creados

### `src/routes/convocatoria/[id]/+page.svelte`
Componente Svelte que renderiza la página de detalles.

**Características principales:**

1. **Reproductor de Video**
   - Elemento `<video>` nativo con controles
   - Soporta MP4, MOV, WebM
   - Obtiene URL desde Supabase Storage (`uploads/` bucket)
   - Aspect ratio 16:9

2. **Información de la Película**
   - Título principal con status badge
   - Categoría (Cortometraje/Largometraje) con icono
   - Fecha de envío formateada
   - Sinopsis completa
   - Detalles en grid:
     - Duración (minutos)
     - Idioma (con indicador de subtítulos)
     - Año de producción
     - Formato
     - Tema (Kórima, Sipáachi, Chérame)

3. **Información del Realizador (Sidebar)**
   - Nombre completo
   - Nombre del colectivo (si aplica)
   - Nacionalidad
   - Biografía
   - Sitio web (link externo)
   - Email y teléfono
   - Botón "Ver más películas"

4. **Estados de Carga**
   - Loading: Spinner con mensaje
   - Error: Card rojo con mensaje de error
   - Success: Contenido completo

5. **Navegación**
   - Botón "Volver a películas" arriba
   - Back link a `/convocatoria`

### `src/routes/convocatoria/[id]/+page.ts`
Archivo de carga del lado del servidor (server-side load).

**Responsabilidades:**
- Valida que el parámetro `id` esté presente
- Retorna el `filmId` al cliente
- Maneja errores 400 si falta el ID

## Flujo de Datos

```
URL: /convocatoria/12345
  ↓
+page.ts: Valida el ID
  ↓
+page.svelte: onMount ejecuta loadFilmDetails()
  ↓
Consulta Supabase films table WHERE id = 12345
  ↓
Si existe participant_id, consulta participants table
  ↓
Renderiza toda la información
```

## Queries Supabase

### 1. Obtener película
```typescript
const { data: filmData } = await supabase
  .from('films')
  .select('*')
  .eq('id', filmId)
  .single();
```

Retorna todos los campos de `films`:
- id, participant_id, title, category, duration_minutes, production_year, language, subtitles, format, video_link, synopsis, theme, status, created_at

### 2. Obtener realizador (opcional)
```typescript
const { data: participantData } = await supabase
  .from('participants')
  .select('*')
  .eq('id', film.participant_id)
  .single();
```

Retorna:
- id, full_name, collective_name, email, phone, nationality, biography, website, etc.

## Manejo de URL de Video

```typescript
function getVideoUrl(): string {
  if (!film?.video_link) return '';
  const baseUrl = 'https://qgawfofncgptjfhbxbds.supabase.co/storage/v1/object/public/uploads/';
  return baseUrl + film.video_link;
}
```

**Nota:** Reemplaza la URL base con tu propia URL de Supabase si es diferente.

## Estilos y Colores

- **Fondo:** Gradiente oscuro (#1E1E1E → #284566)
- **Color primario:** #C1572F (naranja)
- **Color secundario:** #D18730 (mostaza)
- **Status badges:**
  - En revisión: Amarillo
  - Aceptada: Verde
  - Rechazada: Rojo

## Componentes Utilizados

- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription` (Shadcn/UI)
- `Button` (Shadcn/UI)
- Video HTML5 nativo

## Validaciones

- Si no hay ID en la URL: Error 400
- Si la película no existe: Mensaje de error
- Si el realizador no existe: Muestra "Información no disponible"
- Si faltan campos opcionales: Se omiten del display

## Responsividad

- **Mobile:** Layout de 1 columna (video arriba, info abajo)
- **Tablet:** 1 columna con video más grande
- **Desktop:** Grid 2 columnas (video + info a la izquierda, sidebar realizador a la derecha)

Usa `grid-cols-1 lg:grid-cols-3` para layout adaptativo.

## Próximas Mejoras

1. Agregar video previews/thumbnails
2. Botón para compartir en redes sociales
3. Sección de "más películas del realizador"
4. Sistema de ratings/comentarios
5. Botón de descarga (si el estado es Aceptada)
6. Integración con reproductor avanzado (Plyr.io, Video.js)

