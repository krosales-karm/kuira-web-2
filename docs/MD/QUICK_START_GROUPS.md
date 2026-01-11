# Implementación Rápida: Grupos Admin y Participante

## 🚀 Pasos de Implementación

### 1. **Ejecutar Script SQL en Supabase** (5 min)

Ve a tu proyecto Supabase → SQL Editor y ejecuta el contenido de:
```
docs/SETUP_GROUPS_SIMPLE.sql
```

Este script crea:
- Tabla `groups` (admin, participante)
- Tabla `user_groups` (relación usuario-grupo)
- Funciones SQL para verificar permisos
- Políticas de seguridad (RLS)

### 2. **Asignar Primer Admin**

Opción A: Desde Supabase Console
```sql
-- Ejecuta en SQL Editor
INSERT INTO user_groups (user_id, group_id)
VALUES (
  'TU_USER_ID_AQUI',
  (SELECT id FROM groups WHERE name = 'admin')
);
```

Opción B: Desde la App (requiere ser admin primero)
```typescript
// Después de que el SQL se haya ejecutado
import { addUserToGroup } from '$lib/services/groupsService';
await addUserToGroup('user_id', 'admin');
```

### 3. **Modificar Signup para Auto-Asignar Grupo**

En `src/routes/signup/+page.svelte`, después del magic link:

```typescript
// En handleSignup, después del success
// Asignar automáticamente al grupo 'participante'
try {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await addUserToGroup(user.id, 'participante');
  }
} catch (err) {
  console.error('Error asignando grupo:', err);
}
```

### 4. **Usar en Componentes**

#### Verificar si es admin:
```typescript
import { isAdmin, getCurrentUser } from '$lib/services/groupsService';

const user = await getCurrentUser();
if (user.isAdmin) {
  // Mostrar opciones de admin
}
```

#### Verificar permisos antes de renderizar:
```svelte
<script>
  import { isAdmin } from '$lib/services/groupsService';
  
  let isUserAdmin = false;
  
  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    isUserAdmin = await isAdmin(user.id);
  });
</script>

{#if isUserAdmin}
  <AdminPanel />
{:else}
  <UserPanel />
{/if}
```

### 5. **Acceder al Panel Admin**

Navega a: `/admin/usuarios`

Solo usuarios con grupo `admin` pueden verlo. Aquí puedes:
- Ver todos los usuarios
- Agregar/remover del grupo "participante"

---

## 📁 Archivos Creados

```
src/lib/services/
  └── groupsService.ts          # Funciones para gestionar grupos

src/routes/admin/usuarios/
  └── +page.svelte              # Panel admin para gestionar usuarios

docs/
  ├── SETUP_GROUPS_SIMPLE.sql   # Script SQL simplificado
  └── GROUPS_PERMISSIONS.md     # Documentación completa
```

---

## 🔑 Funciones Principales

```typescript
// Obtener usuario actual con grupos
const user = await getCurrentUser();
console.log(user.groups); // ['participante']
console.log(user.isAdmin); // false

// Verificar si es admin
const admin = await isAdmin(userId);

// Obtener grupos de un usuario
const groups = await getUserGroups(userId);

// Asignar a grupo
await addUserToGroup(userId, 'participante');

// Remover de grupo
await removeUserFromGroup(userId, 'participante');

// Obtener todos los usuarios de un grupo
const participants = await getGroupUsers('participante');
```

---

## 🔒 Seguridad (RLS)

Las políticas SQL garantizan que:
- ✅ Cada usuario solo ve sus propios grupos
- ✅ Solo admin puede agregar/remover usuarios de grupos
- ✅ Los grupos son visibles públicamente
- ✅ Función `is_admin()` verifica permisos en la BD

---

## ✅ Checklist

- [ ] Ejecutar `SETUP_GROUPS_SIMPLE.sql` en Supabase
- [ ] Asignar tu usuario al grupo 'admin'
- [ ] Modificar signup para auto-asignar 'participante'
- [ ] Probar panel admin en `/admin/usuarios`
- [ ] Integrar verificación de permisos en componentes
- [ ] (Opcional) Agregar middleware para proteger rutas admin

---

## 🆘 Troubleshooting

**Error: "Grupo no encontrado"**
- Verifica que ejecutaste el script SQL completo
- Comprueba en Supabase Console que existen las tablas `groups` y `user_groups`

**Error: "No tienes permisos"**
- Asegúrate de que tu usuario está en el grupo 'admin' (mira en la vista `user_groups_view`)

**Panel admin devuelve error de autenticación**
- Necesitas hacer login primero
- Debes estar en el grupo 'admin'

---

## 📝 Ejemplo Completo: Proteger Ruta Admin

En `src/routes/admin/+layout.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import { isAdmin } from '$lib/services/groupsService';

export async function load({ data }) {
  const { user } = await data.auth;
  
  if (!user) {
    redirect(303, '/login');
  }
  
  const isUserAdmin = await isAdmin(user.id);
  if (!isUserAdmin) {
    redirect(303, '/');
  }
  
  return { user };
}
```

Así cualquiera que intente entrar a `/admin/*` sin permisos será redirigido.

