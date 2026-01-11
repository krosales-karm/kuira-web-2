# 🎥 Fix: Videos no se muestran (Portadas sí)

## ✅ Diagnóstico Confirmado

**Síntomas:**
- ✅ Portadas (carátulas) **SÍ** se muestran
- ❌ Videos **NO** se muestran
- 🔍 Error probable: 403 Forbidden en consola

**Conclusión:** Las políticas de la **tabla** `files` funcionan correctamente (por eso puedes obtener el `file_path`), pero las **políticas del Storage bucket** están bloqueando el acceso a los videos.

---

## 🚀 Solución Paso a Paso

### Paso 1: Verificar Configuración del Bucket

1. Ve a **Supabase Dashboard**
2. **Storage** → **uploads** (tu bucket)
3. Click en **Configuration** (⚙️)
4. Verifica:
   - ❌ **Public bucket**: Debe estar **desactivado**
   - ✅ **File size limit**: Debe ser al menos **5GB** (5368709120 bytes)
   - ✅ **Allowed MIME types**: Debe estar **vacío** (permite todos) o incluir `video/*`

Si `File size limit` es muy bajo (ej: 100MB), los videos grandes no se pueden subir.

**Cómo cambiar:**
```
File size limit: 5368709120
Allowed MIME types: (dejar vacío)
```

---

### Paso 2: Verificar Políticas Actuales

1. Ve a **Storage** → **uploads**
2. Click en **Policies** (🔐)
3. Verás una lista de políticas existentes

**Probables problemas:**
- No existe política para `SELECT` en videos
- Política restringe por tipo de archivo (solo imágenes)
- Política requiere que seas `owner` pero los archivos tienen owner diferente

---

### Paso 3: Eliminar Políticas Restrictivas (Opcional)

Si hay políticas que bloquean acceso:

1. En la lista de **Policies**
2. Click en los **3 puntos** (⋮) de cada política
3. **Delete policy**

**Elimina políticas que tengan condiciones como:**
- `metadata->>'mimetype' LIKE 'image/%'` (solo permite imágenes)
- `owner = auth.uid()` (muy restrictivo si los archivos no tienen owner correcto)

---

### Paso 4: Crear Políticas Correctas

#### 🟢 Opción A: Políticas Permisivas (Recomendado para desarrollo/testing)

Permite que **todos los usuarios autenticados** vean y suban archivos.

**Política 1: Ver archivos**
```
1. Click "New Policy" → "Create policy from scratch"
2. Nombre: "Authenticated users can view uploads"
3. Allowed operation: SELECT
4. Target roles: authenticated
5. Policy definition (USING):
   bucket_id = 'uploads'
6. Click "Save"
```

**Política 2: Subir archivos**
```
1. Click "New Policy" → "Create policy from scratch"
2. Nombre: "Authenticated users can upload files"
3. Allowed operation: INSERT
4. Target roles: authenticated
5. Policy definition (WITH CHECK):
   bucket_id = 'uploads'
6. Click "Save"
```

**Política 3: Actualizar archivos propios**
```
1. Click "New Policy" → "Create policy from scratch"
2. Nombre: "Users can update own files"
3. Allowed operation: UPDATE
4. Target roles: authenticated
5. USING expression:
   bucket_id = 'uploads' AND auth.uid()::text = owner
6. WITH CHECK expression:
   bucket_id = 'uploads' AND auth.uid()::text = owner
7. Click "Save"
```

**Política 4: Eliminar archivos propios**
```
1. Click "New Policy" → "Create policy from scratch"
2. Nombre: "Users can delete own files"
3. Allowed operation: DELETE
4. Target roles: authenticated
5. Policy definition (USING):
   bucket_id = 'uploads' AND auth.uid()::text = owner
6. Click "Save"
```

---

#### 🔴 Opción B: Políticas Restrictivas (Para producción)

Solo permite ver archivos propios.

**Cambio en Política 1:**
```
USING expression:
bucket_id = 'uploads' AND auth.uid()::text = owner
```

⚠️ **Problema:** Si los archivos tienen `owner` diferente al usuario actual, no podrá verlos.

---

### Paso 5: Verificar en SQL Editor (Opcional)

Ejecuta estas queries para confirmar:

```sql
-- Ver políticas actuales
SELECT 
  name,
  definition,
  allowed_operations
FROM storage.policies
WHERE bucket_id = 'uploads';
```

```sql
-- Ver configuración del bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'uploads';
```

```sql
-- Ver archivos de video
SELECT 
  name,
  owner,
  metadata->>'mimetype' as mime_type,
  metadata->>'size' as size_bytes
FROM storage.objects
WHERE bucket_id = 'uploads'
  AND metadata->>'mimetype' LIKE 'video/%';
```

---

### Paso 6: Probar

1. Recarga la página `/participantes/mis-peliculas/[id]`
2. El video debería cargar y reproducirse
3. Abre la consola del navegador (F12)
4. Verifica que no hay errores 403

---

## 🔍 Debugging Adicional

### Error: "Failed to load video"

**Verificar en consola:**
1. Presiona **F12**
2. Ve a la pestaña **Network**
3. Recarga la página
4. Busca la petición al archivo `.mp4` (o similar)
5. Si ves **403 Forbidden**, las políticas de Storage bloquean acceso
6. Si ves **404 Not Found**, el archivo no existe

**Verificar el archivo:**
```sql
-- Reemplaza VIDEO_FILE_ID con el ID del video
SELECT f.id, f.file_path, f.bucket, o.name, o.owner
FROM files f
LEFT JOIN storage.objects o ON f.file_path = o.name AND f.bucket = o.bucket_id
WHERE f.id = 'VIDEO_FILE_ID';
```

---

## 🆘 Solución de Emergencia

Si necesitas que funcione **inmediatamente** para una demo:

1. Ve a **Storage** → **uploads** → **Configuration**
2. Activa **"Public bucket"** ☑️
3. Guarda

⚠️ **ADVERTENCIA:** Esto hace que **TODOS** los archivos sean públicos. Solo úsalo temporalmente para pruebas.

**Recuerda desactivarlo después** y usar las políticas correctas.

---

## ✅ Configuración Final Recomendada

### Bucket Configuration:
```
Name: uploads
Public: ❌ NO
File size limit: 5368709120 (5GB)
Allowed MIME types: (vacío)
```

### Storage Policies:
```
1. ✅ Authenticated users can view uploads (SELECT)
2. ✅ Authenticated users can upload files (INSERT)
3. ✅ Users can update own files (UPDATE)
4. ✅ Users can delete own files (DELETE)
```

### Tabla 'files' RLS:
```
✅ Ya configurado correctamente (por eso las portadas funcionan)
```

---

## 📊 Comparación: Portadas vs Videos

| Aspecto | Portadas | Videos |
|---------|----------|--------|
| Tabla 'files' | ✅ Funciona | ✅ Funciona |
| Storage policies | ✅ Funciona | ❌ Bloqueado |
| Tamaño archivo | ~2MB | ~500MB+ |
| MIME type | image/jpeg | video/mp4 |
| Signed URL | ✅ Se genera | ✅ Se genera |
| Descarga | ✅ Funciona | ❌ 403 Forbidden |

**Conclusión:** El problema está en las políticas de Storage, no en RLS.

---

## 🎯 Por Qué Sucede Esto

Cuando "moviste las políticas", probablemente:

1. Eliminaste políticas del Storage
2. Creaste nuevas con condiciones diferentes
3. Las nuevas políticas permiten imágenes pero bloquean videos

**Razones comunes:**
- Límite de tamaño del bucket muy bajo
- `allowed_mime_types` solo incluye `image/*`
- Política con condición `metadata->>'mimetype' LIKE 'image/%'`
- Política requiere `owner` pero los videos tienen owner NULL o diferente

---

## 📝 Checklist Final

- [ ] Bucket `uploads` existe
- [ ] File size limit ≥ 5GB
- [ ] Allowed MIME types vacío o incluye `video/*`
- [ ] Public bucket está **desactivado**
- [ ] Existe política SELECT para authenticated
- [ ] Existe política INSERT para authenticated
- [ ] Probé recargar la página
- [ ] El video se reproduce ✅

---

## 🎬 Resultado Esperado

Después de aplicar estos cambios:

✅ Las portadas siguen funcionando  
✅ Los videos ahora se cargan y reproducen  
✅ Las signed URLs se generan correctamente  
✅ No hay errores 403 en consola  
✅ Los usuarios pueden ver sus propias películas completas  

