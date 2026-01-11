# API de Administración

## Configuración Requerida

### Variables de Entorno

Agrega en tu `.env.local` (nunca en `.env.example`):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **IMPORTANTE**: El `SUPABASE_SERVICE_ROLE_KEY` es una clave privada. **NUNCA** la compartas ni la commits al repositorio.

## Endpoints API

### 1. GET `/api/admin/users`

Obtiene la lista de todos los usuarios con sus grupos.

**Permisos requeridos:** Admin

**Respuesta exitosa (200):**
```json
{
  "users": [
    {
      "id": "uuid-del-usuario",
      "email": "user@example.com",
      "created_at": "2025-01-15T10:30:00Z",
      "groups": [
        {
          "id": "uuid-del-grupo",
          "name": "admin" | "participante"
        }
      ]
    }
  ]
}
```

**Errores:**
- `401` - No autenticado
- `403` - No tienes permisos de admin
- `500` - Error del servidor

**Ejemplo en Svelte:**
```typescript
const response = await fetch('/api/admin/users');
const { users } = await response.json();
```

---

### 2. POST `/api/admin/users/groups`

Asigna o remueve un usuario de un grupo.

**Permisos requeridos:** Admin

**Body requerido:**
```json
{
  "action": "assign" | "remove",
  "userId": "uuid-del-usuario",
  "groupName": "admin" | "participante"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "action": "assign",
  "userId": "uuid-del-usuario",
  "groupName": "admin"
}
```

**Errores:**
- `400` - Parámetros inválidos o faltantes
- `401` - No autenticado
- `403` - No tienes permisos de admin
- `500` - Error del servidor

**Ejemplo en Svelte:**
```typescript
// Asignar usuario a admin
const response = await fetch('/api/admin/users/groups', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'assign',
    userId: 'user-uuid-here',
    groupName: 'admin'
  })
});

const result = await response.json();
if (response.ok) {
  console.log('Usuario asignado a admin');
}
```

---

### 3. DELETE `/api/admin/users/[id]`

Elimina un usuario de Supabase Auth.

**Permisos requeridos:** Admin

**URL:** `/api/admin/users/{userId}`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "deletedUserId": "uuid-del-usuario"
}
```

**Errores:**
- `400` - No puedes eliminarte a ti mismo
- `401` - No autenticado
- `403` - No tienes permisos de admin
- `500` - Error del servidor

**Ejemplo en Svelte:**
```typescript
const userId = 'user-uuid-here';
const response = await fetch(`/api/admin/users/${userId}`, {
  method: 'DELETE'
});

const result = await response.json();
if (response.ok) {
  console.log('Usuario eliminado');
}
```

---

## Seguridad

### Verificación de Permisos

Todos los endpoints verifican:

1. **Autenticación**: El usuario debe tener una sesión válida
2. **Autorización**: El usuario debe pertenecer al grupo `admin`
3. **Validación**: Los parámetros deben ser válidos

### Protecciones

- ❌ No puedes eliminarte a ti mismo
- ❌ No puedes cambiar permisos sin ser admin
- ❌ El `SERVICE_ROLE_KEY` nunca se expone al cliente

## Uso desde el Admin Panel

En el panel de administración (`/admin/usuarios`), puedes:

1. **Ver todos los usuarios** y sus grupos
2. **Asignar grupos** (admin/participante)
3. **Remover grupos**
4. **Eliminar usuarios**

Los cambios se aplican inmediatamente.

## Notas Técnicas

### Por qué usar `SUPABASE_SERVICE_ROLE_KEY`?

- El `ANON_KEY` tiene permiso limitado (RLS policies)
- El `SERVICE_ROLE_KEY` permite operaciones de admin sin RLS
- Solo se usa en el servidor, nunca se expone al cliente

### Flujo de Autenticación

```
Cliente solicita /api/admin/users
         ↓
Servidor verifica cookie de sesión
         ↓
Servidor verifica si es admin en user_groups
         ↓
Si ✅ admin: usa SERVICE_ROLE_KEY para obtener datos
Si ❌ no admin: devuelve 403
```

