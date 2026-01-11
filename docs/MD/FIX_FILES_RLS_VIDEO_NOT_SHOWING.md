# 🔧 Fix: Videos no se muestran después de mover políticas RLS

## Problema

Después de mover las políticas de RLS (Row Level Security) de la tabla `files`, los videos ya no se muestran en la página de detalle de película (`/participantes/mis-peliculas/[id]`).

## ¿Por qué sucede?

Cuando se "mueven" o modifican las políticas de RLS, pueden ocurrir dos problemas:

1. **Las políticas se eliminaron** pero no se recrearon correctamente
2. **Las políticas tienen condiciones incorrectas** que bloquean el acceso

La tabla `files` almacena las referencias a los archivos (carátulas y videos) en Supabase Storage. Si las políticas RLS bloquean el acceso a esta tabla, el código no puede obtener las rutas de los archivos y por lo tanto no puede generar las URLs.

## Síntomas

- ✅ La película se carga correctamente
- ✅ Los datos de la película se muestran
- ❌ La carátula no se muestra (mensaje: "No se pudo cargar la carátula")
- ❌ El video no se muestra (mensaje: "No se pudo cargar el video")
- 🔍 En la consola del navegador aparece: `Database error fetching file_path`

## Solución

### Paso 1: Ejecutar el Script SQL

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Abre `/docs/SQL/FIX_FILES_RLS_POLICIES.sql`
3. Copia **TODO** el contenido
4. Pégalo en el SQL Editor
5. Click en **RUN**

Este script:
- ✅ Elimina políticas antiguas/conflictivas
- ✅ Habilita RLS en la tabla `files`
- ✅ Crea 4 políticas correctas:
  - `SELECT`: Ver archivos propios
  - `INSERT`: Subir archivos con tu ID
  - `UPDATE`: Actualizar archivos propios
  - `DELETE`: Eliminar archivos propios

### Paso 2: Verificar las Políticas

Ejecuta esta consulta para confirmar que las políticas existen:

```sql
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'files';
```

**Resultado esperado:**

| policyname | cmd | qual |
|------------|-----|------|
| Users can view own files | SELECT | (auth.uid() = uploader_id) |
| Users can insert own files | INSERT | (auth.uid() = uploader_id) |
| Users can update own files | UPDATE | (auth.uid() = uploader_id) |
| Users can delete own files | DELETE | (auth.uid() = uploader_id) |

### Paso 3: Verificar Storage Policies

Las políticas de la **tabla** `files` son diferentes de las políticas del **bucket** `uploads` en Storage.

1. Ve a **Supabase Dashboard** → **Storage** → **uploads** → **Policies**
2. Verifica que existan políticas para:
   - **SELECT/Download**: Permitir a usuarios ver archivos
   - **INSERT/Upload**: Permitir a usuarios subir archivos

Si no existen, créalas:

#### Política para SELECT (Ver archivos):
```sql
-- Policy name: Users can view uploads
-- Allowed operation: SELECT
-- Policy definition:
bucket_id = 'uploads'
```

#### Política para INSERT (Subir archivos):
```sql
-- Policy name: Users can upload files
-- Allowed operation: INSERT
-- Policy definition:
bucket_id = 'uploads'
```

### Paso 4: Probar

1. Recarga la página `/participantes/mis-peliculas/[id]`
2. Verifica que se muestren:
   - ✅ Carátula de la película
   - ✅ Video (si se subió archivo)

## Debugging Adicional

### Ver los archivos en la base de datos

```sql
-- Ver todos tus archivos
SELECT id, file_path, bucket, uploader_id, created_at
FROM public.files
WHERE uploader_id = auth.uid();
```

### Ver películas y sus archivos

```sql
-- Ver películas con referencias a archivos
SELECT 
  f.id,
  f.title,
  f.cover_file_id,
  f.video_file_id,
  cf.file_path as cover_path,
  vf.file_path as video_path
FROM public.films f
LEFT JOIN public.files cf ON f.cover_file_id = cf.id
LEFT JOIN public.files vf ON f.video_file_id = vf.id
WHERE f.participant_id = auth.uid();
```

### Verificar autenticación

```sql
-- Debe retornar tu UUID
SELECT auth.uid();
```

Si retorna `NULL`, no estás autenticado.

## Errores Comunes

### Error: "new row violates row-level security policy"

**Causa:** La política de INSERT no permite crear registros.

**Solución:** Verifica que la política `Users can insert own files` use `WITH CHECK (auth.uid() = uploader_id)`.

### Error: "No se pudo cargar el video"

**Causas posibles:**

1. **Políticas RLS bloqueando acceso:**
   - Ejecuta el script de fix

2. **Archivo no existe en Storage:**
   ```sql
   -- Verifica si el file_path existe
   SELECT * FROM storage.objects 
   WHERE bucket_id = 'uploads' 
   AND name LIKE '%tu_archivo%';
   ```

3. **Signed URL expirada:**
   - Las signed URLs expiran (el código usa 7 días)
   - Recarga la página para generar nueva URL

4. **CORS del bucket:**
   - Ve a Storage → uploads → Configuration
   - Verifica que CORS esté habilitado

### La carátula se muestra pero el video no

**Causa:** Políticas correctas pero archivo de video no existe o ruta incorrecta.

**Solución:** Verifica que `video_file_id` en la película apunte a un registro válido en `files`:

```sql
SELECT 
  f.id,
  f.title,
  f.video_file_id,
  files.file_path,
  files.bucket
FROM films f
LEFT JOIN files ON f.video_file_id = files.id
WHERE f.id = 'ID_DE_TU_PELICULA';
```

## Cómo Funcionan las Políticas RLS

```
Usuario solicita ver película
         ↓
    Carga datos de la tabla 'films'
         ↓
    Intenta acceder a 'files' para obtener file_path
         ↓
    🔒 RLS verifica: ¿auth.uid() = uploader_id?
         ↓
    Si ✅: Retorna file_path
    Si ❌: Error "permission denied"
         ↓
    Genera signed URL del Storage
         ↓
    🔒 Storage Policy verifica permisos
         ↓
    Si ✅: Retorna URL firmada
    Si ❌: Error 403
         ↓
    Muestra video/imagen en el navegador
```

## Solución Rápida (Emergencia)

Si necesitas que funcione **urgentemente** para pruebas (⚠️ **NO EN PRODUCCIÓN**):

```sql
-- TEMPORAL: Deshabilitar RLS (INSEGURO)
ALTER TABLE public.files DISABLE ROW LEVEL SECURITY;
```

Esto permite acceso sin restricciones. **Úsalo solo para confirmar que el problema son las políticas.**

Después de confirmar, **vuelve a habilitar RLS**:

```sql
-- Re-habilitar RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
```

Y ejecuta el script de fix completo.

## Checklist de Verificación

- [ ] Ejecuté el script `FIX_FILES_RLS_POLICIES.sql`
- [ ] Verifiqué que existen 4 políticas en la tabla `files`
- [ ] Verifiqué las políticas del bucket `uploads` en Storage
- [ ] Probé recargar la página de detalle de película
- [ ] Vi los logs de la consola del navegador (F12)
- [ ] Ejecuté las consultas de debugging
- [ ] La carátula se muestra ✅
- [ ] El video se muestra ✅

## Resultado Final Esperado

✅ Las carátulas se cargan y se muestran  
✅ Los videos se reproducen correctamente  
✅ Las signed URLs se generan sin errores  
✅ Los usuarios solo ven sus propios archivos  
✅ RLS está habilitado y funcionando  

---

**Nota:** Si después de todo esto el problema persiste, comparte:
1. El resultado de la consulta de verificación de políticas
2. Los errores de la consola del navegador
3. El resultado de las consultas de debugging

