# Estructura de Base de Datos - KuiraFestival

## Tablas Actuales en Supabase

### `participants` - Realizadores/Colectivos
Almacena la información de los participantes que envían películas.

```
full_name (TEXT) - Nombre completo del realizador
collective_name (TEXT) - Nombre del colectivo (opcional)
nationality (TEXT) - Nacionalidad
city (TEXT) - Ciudad (actualmente en transición)
email (TEXT) - Email de contacto
phone (TEXT) - Teléfono
website (TEXT) - Sitio web personal
biography (TEXT) - Biografía del realizador
project_role_id (INT) - FK a project_roles
profile_file_id (UUID) - FK a files (foto de perfil)
country_id (INT) - FK a countries
city_id (INT) - FK a cities
created_at (TIMESTAMP) - Fecha de registro
```

### `films` - Películas Enviadas
Almacena la información de las películas enviadas a la convocatoria.

```
id (UUID) - Identificador único
participant_id (UUID) - FK a participants (quién envía)
title (TEXT) - Título de la película
category (TEXT) - Categoría: 'Cortometraje' | 'Largometraje'
duration_minutes (NUMERIC) - Duración en minutos
production_year (INT) - Año de producción
language (TEXT) - Idioma de la película
subtitles (BOOLEAN) - Tiene subtítulos
format (TEXT) - Formato de video (MP4, MOV, WebM)
video_link (TEXT) - Ruta del archivo en storage
video_password (TEXT) - Contraseña para ver (opcional)
synopsis (TEXT) - Sinopsis de la película
theme (TEXT) - Tema: 'Kórima' | 'Sipáachi' | 'Chérame'
status (TEXT) - Estado: 'En revisión' | 'Aceptada' | 'Rechazada'
cover_file_id (UUID) - FK a files (carátula/portada)
created_at (TIMESTAMP) - Fecha de envío
```

### `files` - Almacenamiento de Archivos
Metadatos de archivos subidos (perfil, portadas, etc).

```
id (UUID) - Identificador único
name (TEXT) - Nombre del archivo
size (BIGINT) - Tamaño en bytes
mime_type (TEXT) - Tipo MIME
storage_path (TEXT) - Ruta en Supabase Storage
classification_id (INT) - FK a file_classifications
```

### `file_classifications` - Tipos de Archivos
Clasificación de archivos para organización.

```
id (SERIAL) - Identificador
code (TEXT) - Código corto: 'participant_photo', 'film_cover', 'film_still', etc
name (TEXT) - Nombre descriptivo
description (TEXT) - Descripción
```

### `project_roles` - Roles en Proyectos
Roles que pueden tener los participantes en un proyecto.

```
id (SERIAL) - Identificador
name (TEXT) - Nombre del rol: 'Director/a', 'Productor/a', etc
```

### `countries` y `cities` - Localización
Tablas de referencia para países y ciudades.

```
countries:
  id (SERIAL)
  name (TEXT)

cities:
  id (SERIAL)
  name (TEXT)
  country_id (INT) - FK a countries
```

---

## Buckets de Supabase Storage

### `uploads` - Almacenamiento de Medios
Bucket donde se guardan:
- Películas (videos MP4, MOV, WebM)
- Portadas/Carátulas
- Fotos de perfil
- Otros archivos

Estructura recomendada:
```
uploads/
├── Cortometraje/
│   ├── {uuid}-{timestamp}.mp4
│   └── ...
├── Largometraje/
│   ├── {uuid}-{timestamp}.mp4
│   └── ...
├── profiles/
│   ├── {uuid}.jpg
│   └── ...
└── covers/
    ├── {uuid}.jpg
    └── ...
```

---

## Relaciones

```
participants (1) ──────────→ (N) films
      ↓
    project_roles (M:1)
      ↓
    profile_file_id → files (1:1)

films (1) ──────────→ (1) cover_file_id → files
           ↓
    category: 'Cortometraje' | 'Largometraje'
           ↓
    theme: 'Kórima' | 'Sipáachi' | 'Chérame'
           ↓
    status: 'En revisión' | 'Aceptada' | 'Rechazada'
```

---

## Políticas de Seguridad (RLS)

### `participants`
- **INSERT**: Cualquiera puede registrarse
- **SELECT**: Solo autenticados pueden ver todos
- **UPDATE**: Solo el propietario puede actualizar

### `films`
- **INSERT**: Cualquiera puede enviar una película
- **SELECT**: Solo autenticados (admin) pueden ver
- **UPDATE**: Solo autenticados

### `files`
- **Storage (uploads)**: Cualquiera puede subir

---

## Integración con la Aplicación

### Componentes que usan estas tablas:

1. **VideoUploadForm.svelte**
   - Recolecta datos de formulario (título, sinopsis, idioma, duración)
   - Sube archivo al bucket `uploads`
   - Inserta registro en tabla `films`
   - Inserta registro en tabla `files` para metadatos

2. **VideosList.svelte**
   - Query a tabla `films`
   - Filtra por categoría
   - Muestra información de películas

3. **Página `/admin/participantes`**
   - Query a tabla `participants`
   - Cuenta películas por participante desde tabla `films`
   - Muestra estadísticas

4. **Página `/convocatoria`**
   - Sección de envío usa `VideoUploadForm`
   - Sección de ver videos usa `VideosList`

---

## Campos Esperados vs Actuales

### API de Upload
El endpoint `/api/upload` espera en FormData:
- `file` (File) - El archivo de video
- `category` (string) - 'Cortometraje' | 'Largometraje'
- `title` (string) - Título de la película
- `synopsis` (string, opcional) - Sinopsis
- `language` (string, opcional) - Idioma
- `subtitles` (boolean, opcional) - Tiene subtítulos
- `duration_minutes` (number, opcional) - Duración
- `production_year` (number, opcional) - Año de producción

