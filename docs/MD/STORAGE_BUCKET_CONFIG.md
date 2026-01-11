# Configuración del Bucket de Storage para Patrocinadores y Colaboradores

## Problema
Los logos de patrocinadores y colaboradores no se muestran debido a un error de OpaqueResponseBlocking (CORS).

## Solución

### Paso 1: Verificar que el bucket 'uploads' sea público

1. Ve a tu **Supabase Dashboard**
2. Navega a **Storage** en el menú lateral
3. Selecciona el bucket **uploads**
4. Haz clic en **Settings** (configuración del bucket)
5. **Asegúrate de que "Public bucket" esté activado** ✅

### Paso 2: Configurar CORS en el bucket

Si el bucket ya es público pero sigue bloqueado, ejecuta este SQL:

```sql
-- Actualizar bucket para ser público
UPDATE storage.buckets 
SET public = true 
WHERE id = 'uploads';
```

### Paso 3: Verificar políticas RLS de Storage

Asegúrate de que las políticas de Storage permitan acceso público a las carpetas de patrocinadores y colaboradores. Ya ejecutaste el script `PATROCINADORES_COLABORADORES.sql` que incluye estas políticas:

- ✅ Política para SELECT público en `patrocinadores/*` y `colaboradores/*`
- ✅ Política para INSERT solo admins
- ✅ Política para UPDATE solo admins
- ✅ Política para DELETE solo admins

### Paso 4: Configuración CORS adicional (si es necesario)

Si después de hacer público el bucket sigues teniendo problemas, ve a:

1. **Storage** → **Configuration** → **CORS Policies**
2. Agrega una política CORS:

```json
{
  "allowedOrigins": ["*"],
  "allowedMethods": ["GET", "HEAD"],
  "allowedHeaders": ["*"],
  "maxAge": 3600
}
```

O solo para tu dominio:

```json
{
  "allowedOrigins": ["http://localhost:5173", "https://tu-dominio.com"],
  "allowedMethods": ["GET", "HEAD", "POST", "PUT", "DELETE"],
  "allowedHeaders": ["*"],
  "maxAge": 3600
}
```

### Paso 5: Verificar archivos existentes

Si cambiaste el bucket de privado a público, los archivos que ya estaban subidos podrían necesitar actualizarse. Puedes:

1. Eliminar los logos existentes desde el admin
2. Volver a subirlos (ahora con el bucket público)

## Verificación

Una vez configurado, deberías poder:

1. Ver los logos en los cards de patrocinadores/colaboradores
2. Ver el preview al editar un patrocinador/colaborador
3. Acceder directamente a la URL del logo en el navegador sin errores

Ejemplo de URL que debería funcionar:
```
https://qgawfofncgptjfhbxbds.supabase.co/storage/v1/object/public/uploads/patrocinadores/1764131654535_f79zm.png
```

## Notas

- El error "OpaqueResponseBlocking" indica que el navegador está bloqueando la respuesta por políticas CORS
- Esto se soluciona haciendo el bucket público o configurando CORS correctamente
- Las políticas RLS ya están configuradas para permitir acceso público a las carpetas de logos
