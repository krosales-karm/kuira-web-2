# Setup Automático de Grupo Participante

## Resumen
Este documento explica cómo configurar un trigger automático en Supabase que asigne automáticamente el grupo "participante" a cada nuevo usuario que se registra mediante magic link.

## ¿Qué es un Trigger?
Un trigger es una función de base de datos que se ejecuta automáticamente cuando ocurre un evento específico. En este caso:
- **Evento:** Cuando se crea un nuevo usuario en `auth.users`
- **Acción:** Automáticamente se agrega el usuario a la tabla `user_groups` con el grupo "participante"

## Ventajas de usar Trigger en lugar de código

| Aspecto | Trigger BD | Código Backend |
|--------|-----------|-----------------|
| **Velocidad** | Inmediato | Requiere llamada HTTP |
| **Confiabilidad** | 100% garantizado | Puede fallar si el backend cae |
| **Mantenimiento** | Centralizado en BD | Esparcido en código |
| **Escalabilidad** | Automático | Debe codificar todos los casos |
| **Consistencia** | Fuerza integridad | Depende de implementación |

## Pasos de Configuración

### Paso 1: Ejecutar el SQL Script

1. **Abre Supabase Console**
   - Ve a [supabase.com](https://supabase.com)
   - Accede a tu proyecto

2. **Abre SQL Editor**
   - Click en "SQL Editor" en el menú izquierdo
   - Click en "New Query"

3. **Copia y ejecuta este SQL:**
   ```sql
   -- Crear función para asignar grupo
   CREATE OR REPLACE FUNCTION public.handle_new_user_participante()
   RETURNS TRIGGER AS $$
   DECLARE
     participante_group_id UUID;
   BEGIN
     SELECT id INTO participante_group_id FROM public.groups
     WHERE name = 'participante'
     LIMIT 1;

     IF participante_group_id IS NULL THEN
       INSERT INTO public.groups (name, description, color, icon)
       VALUES ('participante', 'Realizadores participantes - Pueden enviar películas', '#00AA00', 'film')
       RETURNING id INTO participante_group_id;
     END IF;

     INSERT INTO public.user_groups (user_id, group_id, joined_at)
     VALUES (NEW.id, participante_group_id, NOW())
     ON CONFLICT (user_id, group_id) DO NOTHING;

     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Crear trigger
   DROP TRIGGER IF EXISTS on_auth_user_created_participante ON auth.users;

   CREATE TRIGGER on_auth_user_created_participante
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_participante();
   ```

4. **Haz clic en "Run"** (o presiona Ctrl+Enter)
   - Deberías ver "Queries executed successfully"

### Paso 2: Verificar que funcione

#### Método 1: Crear un usuario de prueba
1. Ve a "Authentication" > "Users"
2. Haz clic en "Add user" y crea un usuario con email/password
3. Espera unos segundos
4. Abre SQL Editor y ejecuta:
   ```sql
   SELECT u.id, u.email, g.name 
   FROM public.user_groups ug
   JOIN public.groups g ON ug.group_id = g.id
   JOIN auth.users u ON ug.user_id = u.id
   WHERE g.name = 'participante'
   ORDER BY ug.joined_at DESC
   LIMIT 1;
   ```
5. Deberías ver al nuevo usuario en el resultado

#### Método 2: Revisar en la tabla de auditoría
```sql
SELECT * FROM group_audit_log 
WHERE action = 'added' 
ORDER BY created_at DESC 
LIMIT 5;
```

### Paso 3: Asignar grupo a usuarios existentes (si es necesario)

Si ya tienes usuarios registrados, ejecuta esto UNA SOLA VEZ:

```sql
INSERT INTO public.user_groups (user_id, group_id, joined_at)
SELECT u.id, g.id, NOW()
FROM auth.users u
CROSS JOIN public.groups g
WHERE g.name = 'participante'
AND u.id NOT IN (
  SELECT user_id FROM public.user_groups 
  WHERE group_id = (SELECT id FROM public.groups WHERE name = 'participante')
);
```

## Flujo Completo: Magic Link

Ahora el flujo es:

```
1. Usuario hace clic en "Sign Up" en la web
   ↓
2. Ingresa su email
   ↓
3. Recibe email con magic link (enviado por Supabase)
   ↓
4. Hace clic en el link
   ↓
5. Backend intercambia el código por sesión (auth/callback)
   ↓
6. AUTOMÁTICAMENT: El trigger de Supabase lo agrega a user_groups
   ↓
7. Usuario es redirigido a /participantes/registro
   ↓
8. Usuario completa su perfil
```

## Verificación Manual en la UI

Para verificar que un usuario tiene el grupo correcto en tu aplicación, puedes usar:

```typescript
// En cualquier componente Svelte
const { data: { user } } = await supabase.auth.getUser();

const { data: groups } = await supabase
  .from('user_groups')
  .select('group_id, groups(name)')
  .eq('user_id', user.id);

console.log('Usuario está en estos grupos:', groups);
// Output: [{ group_id: '...', groups: { name: 'participante' } }]
```

## Casos Especiales

### ¿Qué pasa si un usuario se registra dos veces con el mismo email?
- Supabase no permite dos usuarios con el mismo email
- El trigger NO se ejecutará de nuevo
- No hay problema

### ¿Qué pasa si quiero asignar múltiples grupos?
Modifica la función para agregar más:

```sql
-- Insertar múltiples grupos
INSERT INTO public.user_groups (user_id, group_id)
VALUES 
  (NEW.id, (SELECT id FROM public.groups WHERE name = 'participante')),
  (NEW.id, (SELECT id FROM public.groups WHERE name = 'votante'))
ON CONFLICT (user_id, group_id) DO NOTHING;
```

### ¿Cómo elimino el trigger?
```sql
DROP TRIGGER IF EXISTS on_auth_user_created_participante ON auth.users;
```

## Troubleshooting

### "Error: Duplicate key value violates unique constraint"
- Significa que el usuario ya está en el grupo
- No es un error crítico, pero el trigger ya tiene `ON CONFLICT DO NOTHING`

### "Error: Column not found"
- Verifica que la tabla `groups` existe
- Verifica que la tabla `user_groups` existe
- Ejecuta primero el script `SETUP_GROUPS.sql`

### El trigger no se ejecuta
- Verifica que la función se creó correctamente
- Verifica que el trigger se creó correctamente:
  ```sql
  SELECT * FROM information_schema.triggers 
  WHERE trigger_name = 'on_auth_user_created_participante';
  ```

### Los usuarios ven error de permiso
- Verifica que el RLS está configurado correctamente
- Verifica la tabla `user_groups` tiene la política:
  ```sql
  SELECT * FROM pg_policies 
  WHERE tablename = 'user_groups';
  ```

## Cambios en el Código

Se simplificó `/src/routes/auth/callback/+server.ts`:
- **Antes:** Intentaba asignar el grupo manualmente en el callback
- **Ahora:** El trigger de Supabase se encarga automáticamente
- **Beneficio:** Más confiable y menos código

## Monitoreo y Auditoría

Ver todos los cambios de grupos:
```sql
SELECT 
  gal.created_at,
  u.email,
  g.name,
  gal.action
FROM group_audit_log gal
LEFT JOIN auth.users u ON gal.user_id = u.id
LEFT JOIN groups g ON gal.group_id = g.id
ORDER BY gal.created_at DESC
LIMIT 50;
```

## Resumen de Archivos

- **SQL Script:** `/docs/AUTO_ASSIGN_PARTICIPANTE_GROUP.sql`
- **Código actualizado:** `/src/routes/auth/callback/+server.ts`
- **Setup Original:** `/docs/SETUP_GROUPS.sql`

¡Listo! Tu sistema de asignación automática de grupos está configurado.
