# Guía: Asignar Grupos y Permisos a Usuarios en Supabase

## Opciones Principales

### Opción 1: Roles y Permisos con Metadata de Auth (Recomendado para simplificar)

Usa el campo `raw_app_meta_data` o `raw_user_meta_data` en `auth.users` para almacenar roles/grupos.

**Ventaja:** Fácil de implementar, información viaja en el JWT.
**Desventaja:** Limitado en complejidad.

```sql
-- No requiere tablas adicionales
-- Supabase la gestiona automáticamente
```

**Desde la aplicación (TypeScript/JavaScript):**

```typescript
import { supabase } from '$lib/supabaseClient';

// 1. Asignar grupo durante signup
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'Juan Pérez',
      group: 'participante', // 'admin', 'moderador', 'participante'
      role: 'director'
    }
  }
});

// 2. Leer grupo del usuario actual
const { data: { user } } = await supabase.auth.getUser();
const userGroup = user?.user_metadata?.group;
console.log('Grupo del usuario:', userGroup);

// 3. Actualizar grupo de un usuario (requiere ser admin)
const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
  userId,
  {
    user_metadata: { 
      group: 'moderador',
      role: 'productor'
    }
  }
);
```

---

### Opción 2: Tabla de Grupos (Recomendado para control granular)

Crea tablas para gestionar grupos y pertenencias explícitamente.

**Ventaja:** Control total, puede tener múltiples grupos por usuario.
**Desventaja:** Requiere queries adicionales.

#### Paso 1: Crear las tablas SQL

```sql
-- Tabla de grupos
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#000000',
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de relación usuario-grupo (muchos a muchos)
CREATE TABLE user_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, group_id)
);

-- Insertar grupos por defecto
INSERT INTO groups (name, description, color) VALUES
  ('admin', 'Administradores del festival', '#FF0000'),
  ('moderador', 'Moderadores de contenido', '#0066FF'),
  ('participante', 'Realizadores participantes', '#00AA00'),
  ('jurado', 'Miembros del jurado', '#FFAA00');

-- Índices para mejor rendimiento
CREATE INDEX idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX idx_user_groups_group_id ON user_groups(group_id);
```

#### Paso 2: Configurar RLS (Row Level Security)

```sql
-- Habilitar RLS en las tablas
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;

-- Políticas para `groups` (lectura pública, escritura solo admin)
CREATE POLICY "Ver grupos públicos" ON groups
  FOR SELECT USING (true);

CREATE POLICY "Crear grupos solo admin" ON groups
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM user_groups 
      WHERE group_id = (SELECT id FROM groups WHERE name = 'admin')
    )
  );

-- Políticas para `user_groups` (cada usuario ve sus grupos)
CREATE POLICY "Ver propios grupos" ON user_groups
  FOR SELECT USING (
    user_id = auth.uid() OR 
    auth.uid() IN (
      SELECT user_id FROM user_groups 
      WHERE group_id = (SELECT id FROM groups WHERE name = 'admin')
    )
  );

CREATE POLICY "Administrador puede gestionar grupos" ON user_groups
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM user_groups 
      WHERE group_id = (SELECT id FROM groups WHERE name = 'admin')
    )
  );
```

#### Paso 3: Funciones Helper en TypeScript

```typescript
// src/lib/groupsService.ts

import { supabase } from '$lib/supabaseClient';

/**
 * Obtener todos los grupos de un usuario
 */
export async function getUserGroups(userId: string) {
  const { data, error } = await supabase
    .from('user_groups')
    .select('groups(id, name, description, color, icon)')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data?.map(ug => ug.groups) || [];
}

/**
 * Verificar si un usuario pertenece a un grupo
 */
export async function userIsInGroup(userId: string, groupName: string) {
  const { data, error, count } = await supabase
    .from('user_groups')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('groups.name', groupName);
  
  if (error) throw error;
  return count && count > 0;
}

/**
 * Asignar usuario a un grupo (requiere ser admin)
 */
export async function addUserToGroup(userId: string, groupName: string) {
  // Obtener el ID del grupo
  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .select('id')
    .eq('name', groupName)
    .single();
  
  if (groupError) throw groupError;
  
  // Añadir usuario al grupo
  const { error } = await supabase
    .from('user_groups')
    .insert({
      user_id: userId,
      group_id: groupData.id
    });
  
  if (error) throw error;
}

/**
 * Remover usuario de un grupo
 */
export async function removeUserFromGroup(userId: string, groupName: string) {
  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .select('id')
    .eq('name', groupName)
    .single();
  
  if (groupError) throw groupError;
  
  const { error } = await supabase
    .from('user_groups')
    .delete()
    .eq('user_id', userId)
    .eq('group_id', groupData.id);
  
  if (error) throw error;
}

/**
 * Obtener todos los usuarios de un grupo
 */
export async function getGroupUsers(groupName: string) {
  const { data, error } = await supabase
    .from('user_groups')
    .select('user_id, auth.users(id, email, user_metadata)')
    .eq('groups.name', groupName);
  
  if (error) throw error;
  return data;
}

/**
 * Usuario actual es admin
 */
export async function isCurrentUserAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return false;
  
  return userIsInGroup(user.id, 'admin');
}
```

---

### Opción 3: Tabla `participants` con campo `role`

Usa tu tabla existente de `participants` y añade un campo `role`.

```sql
-- Añadir columna a tabla existente
ALTER TABLE participants ADD COLUMN role TEXT DEFAULT 'participante';

-- O si no existe la columna, crearla con constraint
ALTER TABLE participants 
ADD COLUMN role TEXT DEFAULT 'participante' 
CHECK (role IN ('admin', 'moderador', 'participante', 'jurado'));
```

**Desde la aplicación:**

```typescript
// Obtener rol del usuario
const { data, error } = await supabase
  .from('participants')
  .select('role')
  .eq('user_id', userId)
  .single();

const userRole = data?.role;

// Actualizar rol (solo admin)
const { error: updateError } = await supabase
  .from('participants')
  .update({ role: 'moderador' })
  .eq('user_id', userId);
```

---

## Comparativa de Opciones

| Característica | Opción 1 (Metadata) | Opción 2 (Tabla grupos) | Opción 3 (Participantes) |
|---|---|---|---|
| **Simplificar** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Escalabilidad** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Múltiples grupos** | ❌ | ✅ | ❌ |
| **Datos en JWT** | ✅ | ❌ | ❌ |
| **Queries requeridas** | 0 | 1 | 1 |
| **RLS Support** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Recomendación para KuiraFestival

Para tu caso (festival, múltiples roles: admin, moderador, participante, jurado):

**Opción 2 (Tabla de Grupos)** es la más flexible y escalable. Te permite:
- Asignar múltiples roles a un usuario
- Gestionar permisos granulares
- Audit trail completo
- Evitar duplicación de datos

---

## Implementación en Componentes Svelte

### Ejemplo: Admin Panel para Asignar Grupos

```svelte
<!-- +page.svelte (Admin > Grupos) -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { addUserToGroup, removeUserFromGroup, getGroupUsers } from '$lib/groupsService';

  let selectedGroup = 'participante';
  let groupUsers = [];
  let loading = false;
  let error = '';

  onMount(async () => {
    await loadGroupUsers();
  });

  async function loadGroupUsers() {
    loading = true;
    try {
      groupUsers = await getGroupUsers(selectedGroup);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function removeUser(userId: string) {
    try {
      await removeUserFromGroup(userId, selectedGroup);
      await loadGroupUsers();
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="p-6">
  <h1>Gestionar Grupos</h1>
  
  <select bind:value={selectedGroup} on:change={loadGroupUsers}>
    <option>admin</option>
    <option>moderador</option>
    <option>participante</option>
    <option>jurado</option>
  </select>

  {#if loading}
    <p>Cargando...</p>
  {:else if error}
    <p style="color: red">{error}</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Email</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {#each groupUsers as { user_id, auth.users as user }}
          <tr>
            <td>{user.user_metadata?.full_name}</td>
            <td>{user.email}</td>
            <td>
              <button on:click={() => removeUser(user_id)}>Remover</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
```

---

## Checklist de Implementación

- [ ] Elegir estrategia (recomendado: Opción 2)
- [ ] Crear tablas SQL en Supabase
- [ ] Configurar RLS policies
- [ ] Crear funciones helper (`groupsService.ts`)
- [ ] Implementar componente admin para gestionar grupos
- [ ] Actualizar componentes para verificar permisos
- [ ] Probar asignación de grupos

