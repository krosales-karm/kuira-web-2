-- =============================================
-- KUIRA Festival - Schema de Base de Datos
-- =============================================

-- Eliminar tabla si existe (solo para desarrollo)
-- DROP TABLE IF EXISTS registros;

-- Tabla principal de registros de obras
CREATE TABLE IF NOT EXISTS registros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Información Personal
    email VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    nombre_colectivo VARCHAR(255),
    telefono VARCHAR(20) NOT NULL,
    sitio_web VARCHAR(500),
    nacionalidad VARCHAR(100) NOT NULL,

    -- Ubicación
    pais VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,

    -- Información Profesional
    rol VARCHAR(50) NOT NULL,
    biografia TEXT NOT NULL,

    -- Datos de la Obra
    titulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    tema VARCHAR(50) NOT NULL,
    duracion INTEGER NOT NULL,
    ano_produccion INTEGER NOT NULL,
    idioma_principal VARCHAR(100) NOT NULL,
    formato_video VARCHAR(50) NOT NULL,
    tiene_subtitulos VARCHAR(50) NOT NULL,
    sinopsis TEXT NOT NULL,

    -- Archivos (rutas en Storage)
    caratula_url TEXT NOT NULL,
    video_url TEXT,

    -- Términos y condiciones
    acepta_terminos BOOLEAN NOT NULL DEFAULT false,

    -- Estado del registro
    estado VARCHAR(20) DEFAULT 'pendiente' NOT NULL,
    notas_admin TEXT
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_registros_email ON registros(email);
CREATE INDEX IF NOT EXISTS idx_registros_estado ON registros(estado);
CREATE INDEX IF NOT EXISTS idx_registros_categoria ON registros(categoria);
CREATE INDEX IF NOT EXISTS idx_registros_tema ON registros(tema);
CREATE INDEX IF NOT EXISTS idx_registros_created_at ON registros(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_registros_updated_at ON registros;
CREATE TRIGGER update_registros_updated_at
    BEFORE UPDATE ON registros
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir inserción pública de registros" ON registros;
DROP POLICY IF EXISTS "Permitir lectura pública de registros" ON registros;

-- Política para permitir inserción pública (usuarios anónimos pueden registrar obras)
CREATE POLICY "Permitir inserción pública de registros"
ON registros
FOR INSERT
TO anon
WITH CHECK (true);

-- Política para permitir lectura pública (opcional, para que el usuario vea su registro)
CREATE POLICY "Permitir lectura pública de registros"
ON registros
FOR SELECT
TO anon
USING (true);

-- =============================================
-- Tabla de Mensajes de Contacto
-- =============================================

CREATE TABLE IF NOT EXISTS contactos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Datos del mensaje
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    asunto VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,

    -- Estado del mensaje
    leido BOOLEAN DEFAULT false NOT NULL,
    respondido BOOLEAN DEFAULT false NOT NULL,
    notas_admin TEXT
);

-- Índices para contactos
CREATE INDEX IF NOT EXISTS idx_contactos_email ON contactos(email);
CREATE INDEX IF NOT EXISTS idx_contactos_asunto ON contactos(asunto);
CREATE INDEX IF NOT EXISTS idx_contactos_leido ON contactos(leido);
CREATE INDEX IF NOT EXISTS idx_contactos_created_at ON contactos(created_at DESC);

-- Habilitar RLS para contactos
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir inserción pública de contactos" ON contactos;

-- Política para permitir inserción pública (usuarios anónimos pueden enviar mensajes)
CREATE POLICY "Permitir inserción pública de contactos"
ON contactos
FOR INSERT
TO public
WITH CHECK (true);

-- =============================================
-- Storage Buckets (ejecutar en SQL Editor de Supabase)
-- =============================================

-- Crear bucket para carátulas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'caratulas',
    'caratulas',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Crear bucket para videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'videos',
    'videos',
    true,
    107374182400, -- 100GB
    ARRAY['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/x-msvideo', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 207374182400,
    allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/x-msvideo', 'video/webm'];

-- =============================================
-- Storage Policies
-- =============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir subida pública de carátulas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir lectura pública de carátulas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida pública de videos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir lectura pública de videos" ON storage.objects;

-- Políticas para bucket de carátulas
CREATE POLICY "Permitir subida pública de carátulas"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'caratulas');

CREATE POLICY "Permitir lectura pública de carátulas"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'caratulas');

-- Políticas para bucket de videos
CREATE POLICY "Permitir subida pública de videos"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Permitir lectura pública de videos"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'videos');
