# Esquema de Base de Datos - KuiraFestival

## Tablas Actuales

### `files` (Existente)
Almacena los metadatos de los videos subidos a la plataforma.

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  size BIGINT,
  video_type TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);
```

**Campos:**
- `id` - Identificador único
- `file_name` - Nombre del archivo
- `file_path` - Ruta en Supabase Storage
- `mime_type` - Tipo MIME (ej: video/mp4)
- `size` - Tamaño en bytes
- `video_type` - Categoría (cortometraje, largometraje, documental)
- `uploaded_at` - Fecha de subida
- `status` - Estado del video (pending, approved, rejected)

---

## Tablas Recomendadas

### `participants` (Recomendado)
Almacena la información de los participantes/usuarios que envían videos.

```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  bio TEXT,
  profile_image_url TEXT,
  website TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  total_submissions INT DEFAULT 0
);
```

**Campos:**
- `id` - Identificador único
- `user_id` - Referencia al usuario de Supabase Auth
- `name` - Nombre completo
- `email` - Email
- `phone` - Teléfono
- `country` - País
- `bio` - Biografía/descripción
- `profile_image_url` - URL de foto de perfil
- `website` - Sitio web personal
- `created_at` - Fecha de registro
- `updated_at` - Última actualización
- `total_submissions` - Total de envíos

---

### `submissions` (Opcional)
Vincula videos con participantes y proporciona metadatos adicionales.

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  UNIQUE(file_id)
);
```

---

### `festival_rounds` (Opcional)
Para manejar múltiples convocatorias/rondas.

```sql
CREATE TABLE festival_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  categories TEXT[] DEFAULT ARRAY['cortometraje', 'largometraje', 'documental'],
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Instrucciones para Crear las Tablas en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a la sección "SQL Editor"
3. Copia y ejecuta los scripts SQL anteriores
4. Configura las políticas de seguridad (RLS) según sea necesario

## Relaciones Propuestas

```
participants (1) ──────────→ (N) files
                              ↓ (comentarios, ratings, etc)
                          
festival_rounds (1) ─────────→ (N) submissions
                               ↑
                          participants (1) ──→ (N)
```

## Políticas de Seguridad (RLS)

Recomendado para `participants`:
- Los participantes pueden ver su propio perfil
- Los administradores pueden ver todos los perfiles
- Los datos públicos (nombre, bio) son visibles para todos

