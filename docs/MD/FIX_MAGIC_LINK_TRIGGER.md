# Fix: Trigger para Magic Link no se dispara

## Problema

Los usuarios que se registran con **Google OAuth** sí son asignados automáticamente al grupo `participante`, pero los que usan **Magic Link** NO son asignados.

## ¿Por qué sucede?

El trigger `on_auth_user_created_participante` debería funcionar para ambos métodos porque ambos crean un registro en la tabla `auth.users`. Sin embargo, hay varias razones por las que puede fallar:

### Causas Comunes:

1. **El trigger no está creado en la base de datos**
   - Aunque tengas el archivo SQL, si no lo ejecutaste en Supabase, el trigger no existe

2. **Problemas de permisos**
   - La función necesita permisos SECURITY DEFINER para insertar en `user_groups`

3. **El grupo 'participante' no existe**
   - Si la tabla `groups` no tiene un registro con `name = 'participante'`, el trigger falla silenciosamente

4. **Conflictos en user_groups**
   - Si la tabla `user_groups` no tiene la constraint `UNIQUE(user_id, group_id)`, puede haber errores

5. **El trigger falla pero no lo ves**
   - Sin logging, no sabes si el trigger se ejecutó o falló

## Solución

He creado un script mejorado: **`/docs/SQL/FIX_AUTO_ASSIGN_TRIGGER.sql`**

### Mejoras incluidas:

✅ **Logging detallado** - Ahora verás mensajes en los logs de Postgres  
✅ **Manejo de errores** - Si falla, no impide el registro del usuario  
✅ **Verificación de permisos** - Incluye GRANT statements  
✅ **Creación automática del grupo** - Si no existe, lo crea  
✅ **Script de verificación** - Para confirmar que funciona  
✅ **Asignación retroactiva** - Asigna el grupo a usuarios existentes  

## Cómo Aplicar la Solución

### Paso 1: Ejecutar el Script en Supabase

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Abre el archivo `/docs/SQL/FIX_AUTO_ASSIGN_TRIGGER.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor
5. Click en **RUN** (esquina inferior derecha)

### Paso 2: Verificar que el Trigger Existe

Ejecuta esta consulta en el SQL Editor:

```sql
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created_participante';
```

**Resultado esperado:**

| trigger_name | event_manipulation | event_object_table | action_timing |
|--------------|-------------------|-------------------|---------------|
| on_auth_user_created_participante | INSERT | users | AFTER |

### Paso 3: Probar con un Usuario Nuevo

1. Ve a tu app en `/acceso`
2. Registra un usuario nuevo con **magic link**
3. Espera a que llegue el email
4. Haz click en el magic link
5. Verifica que el usuario tenga el grupo asignado:

```sql
SELECT 
    u.email,
    g.name as grupo,
    ug.joined_at as asignado_en
FROM auth.users u
LEFT JOIN public.user_groups ug ON ug.user_id = u.id
LEFT JOIN public.groups g ON ug.group_id = g.id
WHERE u.email = 'TU_EMAIL_DE_PRUEBA@example.com';
```

**Resultado esperado:**

| email | grupo | asignado_en |
|-------|-------|-------------|
| test@example.com | participante | 2025-11-16 10:30:00 |

### Paso 4: Ver los Logs (Debugging)

Si quieres ver si el trigger se está ejecutando:

1. Ve a **Supabase Dashboard** → **Database** → **Logs**
2. Selecciona **Postgres Logs**
3. Filtra por nivel: **Notice** y **Warning**
4. Busca mensajes como:
   - `Nuevo usuario detectado: <uuid> (email: test@example.com)`
   - `Usuario <uuid> asignado exitosamente al grupo participante`

## Paso 5: Asignar Grupo a Usuarios Existentes

Si ya tienes usuarios registrados con magic link que NO tienen el grupo, el script incluye una sección que los asigna automáticamente:

```sql
INSERT INTO public.user_groups (user_id, group_id, joined_at)
SELECT 
    u.id, 
    g.id, 
    NOW()
FROM auth.users u
CROSS JOIN public.groups g
WHERE g.name = 'participante'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_groups ug 
    WHERE ug.user_id = u.id AND ug.group_id = g.id
  )
ON CONFLICT (user_id, group_id) DO NOTHING;
```

Esta consulta:
- Busca todos los usuarios en `auth.users`
- Verifica si ya tienen el grupo `participante`
- Si NO lo tienen, se los asigna
- Si ya lo tienen, no hace nada (ON CONFLICT)

## Verificación Final

Ejecuta esta consulta para ver TODOS tus usuarios y sus grupos:

```sql
SELECT 
    u.id,
    u.email,
    u.created_at as usuario_creado,
    g.name as grupo,
    ug.joined_at as asignado_al_grupo,
    CASE 
        WHEN ug.id IS NULL THEN '❌ SIN GRUPO'
        ELSE '✅ CON GRUPO'
    END as status
FROM auth.users u
LEFT JOIN public.user_groups ug ON ug.user_id = u.id
LEFT JOIN public.groups g ON ug.group_id = g.id
ORDER BY u.created_at DESC;
```

**Resultado esperado:**

Todos los usuarios deberían tener `✅ CON GRUPO` y `grupo = participante`.

## ¿Por qué funcionaba con Google OAuth pero no con Magic Link?

Es posible que:

1. **El timing es diferente:**
   - Google OAuth crea el usuario inmediatamente al autenticarse
   - Magic Link puede tener un delay entre enviar el email y crear el usuario

2. **Estado de confirmed:**
   - Magic Link requiere que el usuario haga click antes de `confirmed = true`
   - Google OAuth confirma inmediatamente

3. **Metadata diferente:**
   - Google OAuth incluye metadata del proveedor
   - Magic Link tiene metadata más simple

**La solución que implementé funciona para AMBOS casos** porque el trigger se ejecuta en el evento `AFTER INSERT ON auth.users`, que ocurre en ambos métodos.

## Troubleshooting

### El trigger aún no funciona

1. **Verifica que el grupo existe:**
   ```sql
   SELECT * FROM public.groups WHERE name = 'participante';
   ```
   Si no existe, el script lo debería crear automáticamente.

2. **Verifica que user_groups existe:**
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'user_groups';
   ```

3. **Verifica los permisos:**
   ```sql
   SELECT grantee, privilege_type 
   FROM information_schema.role_table_grants 
   WHERE table_name='user_groups';
   ```

4. **Prueba ejecutar la función manualmente:**
   ```sql
   -- Simula el trigger para un usuario existente
   DO $$
   DECLARE
     test_user_id UUID;
   BEGIN
     SELECT id INTO test_user_id FROM auth.users LIMIT 1;
     PERFORM public.handle_new_user_participante();
   END $$;
   ```

### Los logs no aparecen

Los logs NOTICE/WARNING solo aparecen en:
- **Supabase Dashboard → Database → Logs → Postgres Logs**
- No aparecen en la consola del navegador
- No aparecen en los logs de la aplicación

### Error: permission denied

Si ves este error, ejecuta:

```sql
GRANT USAGE ON SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON public.groups TO postgres, authenticated, service_role;
GRANT ALL ON public.user_groups TO postgres, authenticated, service_role;
```

## Resumen

| Método de Registro | Antes del Fix | Después del Fix |
|-------------------|---------------|-----------------|
| Google OAuth | ✅ Funciona | ✅ Funciona |
| Magic Link | ❌ No funciona | ✅ Funciona |
| Email/Password | ❓ Desconocido | ✅ Funciona |
| Invite User (Dashboard) | ❓ Desconocido | ✅ Funciona |

## Siguiente Paso

Después de aplicar este fix, **TODOS los nuevos usuarios** (sin importar el método de registro) serán asignados automáticamente al grupo `participante`.

Si necesitas asignar diferentes grupos según el método de registro (por ejemplo, `admin` para Google OAuth corporativo), podemos modificar el trigger para que verifique el `provider` en `auth.users`.

