# Protección de Rutas de Admin

## Resumen

Los usuarios registrados como **participantes NO pueden acceder a /admin** por ninguna razón.

## Cómo funciona

### 1. **Protección en Cliente** (`/src/routes/admin/+layout.svelte`)
- Cuando un usuario accede a cualquier ruta bajo `/admin`:
  - Se verifica si está autenticado
  - Se consulta la tabla `user_groups` para obtener sus grupos
  - Se busca si el usuario está en el grupo `admin`
  - Si NO es admin: Se redirige a `/` con un mensaje de "Acceso Denegado"

## Flujo de Verificación

```
Usuario intenta acceder /admin
         ↓
¿Está autenticado?
    NO  → Redirige a /login
    SÍ  → ¿Tiene grupo 'admin'?
             NO  → Muestra "Acceso Denegado" (SIN redirigir)
             SÍ  → Muestra panel de admin
```

### Importante:
- **SIN sesión** → Redirige a `/login` (para que inicie sesión)
- **CON sesión pero NO admin** → Muestra mensaje "Acceso Denegado" (permanece autenticado)

### 3. **Cambiar un Usuario a Admin**

Para promover un usuario a admin en Supabase SQL Editor:

```sql
-- 1. Obtén el ID del usuario desde la tabla auth.users
SELECT id, email FROM auth.users WHERE email = 'usuario@example.com';

-- 2. Obtén el ID del grupo 'admin'
SELECT id FROM groups WHERE name = 'admin';

-- 3. Asigna el usuario al grupo admin
INSERT INTO user_groups (user_id, group_id)
VALUES ('UUID_DEL_USUARIO', 'UUID_DEL_GRUPO_ADMIN');
```

## Niveles de Protección

- **Cliente**: Verificación visual y redirección en tiempo real
- **Base de datos**: RLS policies en la tabla `user_groups` (si está configurada)

## Seguridad

- Los usuarios NO pueden manipular su grupo directamente
- La verificación se hace cada vez que acceden a `/admin`
- No hay caché de permisos (se consulta fresh cada acceso)

