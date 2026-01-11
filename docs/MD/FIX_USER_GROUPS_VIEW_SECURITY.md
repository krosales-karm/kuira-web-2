# 🔒 FIX: Vulnerabilidad de Seguridad - user_groups_view

## ⚠️ Problema Crítico

La vista `user_groups_view` estaba exponiendo datos sensibles de `auth.users` a roles no autorizados (`anon` y `authenticated`).

### Datos Expuestos:
- ✉️ **Email** de todos los usuarios
- 🆔 **User ID** de todos los usuarios  
- 👤 **Nombre completo** (metadata)
- 👥 **Grupos asignados**

### Riesgo:
**Cualquier usuario autenticado podía ejecutar:**
```sql
SELECT * FROM user_groups_view;
```
Y ver **TODOS** los emails y datos de **TODOS** los usuarios del sistema.

---

## ✅ Solución Implementada

### 1. Vista Eliminada
La vista `user_groups_view` ha sido **completamente eliminada**.

### 2. Dos Funciones Seguras Creadas

#### A) `get_users_with_groups()` - Solo Admins
```sql
SELECT * FROM get_users_with_groups();
```
- ✅ **Solo** usuarios con rol `admin` pueden ejecutarla
- ✅ Retorna información completa de todos los usuarios
- ✅ Usa `SECURITY DEFINER` con validación `is_admin()`
- ❌ Falla con error si no eres admin

#### B) `get_my_groups()` - Usuarios Regulares
```sql
SELECT * FROM get_my_groups();
```
- ✅ **Cualquier** usuario autenticado puede ejecutarla
- ✅ Retorna **solo** los grupos del usuario actual
- ✅ No expone información de otros usuarios
- ❌ Falla si no estás autenticado

---

## 📋 Cómo Aplicar el Fix

### Paso 1: Ejecutar el Script SQL

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Abre `/docs/SQL/FIX_USER_GROUPS_VIEW_SECURITY.sql`
3. Copia **TODO** el contenido
4. Pégalo en el SQL Editor
5. Click **RUN**

### Paso 2: Verificar que Funcionó

```sql
-- Debe retornar 0 rows (vista eliminada)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'user_groups_view';

-- Debe mostrar las 2 nuevas funciones
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_users_with_groups', 'get_my_groups');
```

### Paso 3: Actualizar Código (Si Es Necesario)

**Buenas noticias:** Tu código NO usa `user_groups_view`, así que no necesitas cambiar nada en el frontend.

Si en el futuro necesitas:

#### Para Admin Dashboard (ver todos los usuarios):
```typescript
// TypeScript/JavaScript
const { data, error } = await supabase.rpc('get_users_with_groups');

if (error) {
  console.error('Error (probablemente no eres admin):', error.message);
} else {
  console.log('Usuarios:', data);
}
```

#### Para Usuarios Regulares (ver mis grupos):
```typescript
const { data, error } = await supabase.rpc('get_my_groups');

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Mis grupos:', data);
}
```

---

## 🧪 Testing

### Test 1: Usuario No-Admin
```typescript
// Como usuario regular (NO admin)
const { data, error } = await supabase.rpc('get_users_with_groups');

// Resultado esperado:
// error: "Acceso denegado: Solo administradores pueden ver esta información"
```

### Test 2: Usuario Regular - Ver Sus Grupos
```typescript
// Como cualquier usuario autenticado
const { data, error } = await supabase.rpc('get_my_groups');

// Resultado esperado:
// data: [{ group_name: 'participante', group_description: '...', ... }]
```

### Test 3: Admin - Ver Todos los Usuarios
```typescript
// Como admin
const { data, error } = await supabase.rpc('get_users_with_groups');

// Resultado esperado:
// data: [
//   { user_id: '...', email: 'user1@...', groups: 'participante', ... },
//   { user_id: '...', email: 'user2@...', groups: 'admin, participante', ... }
// ]
```

---

## 📊 Comparación Antes vs Después

| Aspecto | ❌ ANTES (Inseguro) | ✅ DESPUÉS (Seguro) |
|---------|-------------------|-------------------|
| **Tipo** | Vista pública | Funciones con validación |
| **Acceso anon** | ✅ Sí (MALO) | ❌ No |
| **Acceso authenticated** | ✅ Todos los datos (MALO) | ✅ Solo sus datos |
| **Acceso admin** | ✅ Todos los datos | ✅ Todos los datos |
| **Exposición de emails** | ⚠️ Todos expuestos | ✅ Solo admin o propio |
| **Exposición de user IDs** | ⚠️ Todos expuestos | ✅ Solo admin o propio |
| **Cumple GDPR/privacidad** | ❌ No | ✅ Sí |

---

## 🔍 ¿Por Qué Era Peligroso?

### Escenario de Ataque:
1. Un usuario malintencionado se registra normalmente
2. Obtiene acceso como usuario `authenticated`
3. Ejecuta: `SELECT * FROM user_groups_view`
4. **Ve TODOS los emails** de participantes, admins, etc.
5. Puede usar esos emails para:
   - Phishing
   - Spam
   - Ataques de ingeniería social
   - Correlacionar con otras bases de datos filtradas

### Ejemplo Real:
```sql
-- Cualquier usuario podía hacer esto:
SELECT email, full_name, groups 
FROM user_groups_view 
WHERE groups LIKE '%admin%';

-- Y obtener emails de TODOS los admins del sistema
```

---

## 📚 Mejores Prácticas Aplicadas

✅ **Principio de Menor Privilegio**  
Los usuarios solo ven lo que necesitan ver.

✅ **SECURITY DEFINER con Validación**  
Las funciones se ejecutan con permisos elevados, pero validan quién las llama.

✅ **Separación de Funciones**  
Una función para admins, otra para usuarios regulares.

✅ **No Exponer auth.users**  
Nunca crear vistas que expongan directamente datos de `auth.users`.

✅ **Auditoría** (Opcional)  
El script incluye una tabla `admin_audit_log` para registrar accesos sensibles.

---

## 🛡️ Recomendaciones Adicionales

### 1. Revisar Otras Vistas
Verifica si hay otras vistas que expongan `auth.users`:

```sql
SELECT 
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
  AND view_definition LIKE '%auth.users%';
```

### 2. Habilitar RLS en Todas las Tablas
```sql
-- Verifica que todas tus tablas tengan RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;
```

### 3. Revisar Políticas RLS
```sql
-- Lista todas las políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4. Usar Supabase Security Advisor
En el Dashboard de Supabase:
1. Ve a **Database** → **Security Advisor**
2. Ejecuta un escaneo
3. Resuelve las advertencias que aparezcan

---

## ⚡ Impacto en tu Aplicación

### ✅ Sin Impacto Negativo
- Tu código **NO usa** `user_groups_view`
- No necesitas cambiar nada en el frontend
- Los usuarios siguen funcionando normalmente

### ✅ Mejora de Seguridad
- Emails y datos sensibles ahora protegidos
- Cumple con regulaciones de privacidad (GDPR, CCPA)
- Reduce superficie de ataque

### 🔄 Si Necesitas la Funcionalidad
- Usa `get_my_groups()` para usuarios
- Usa `get_users_with_groups()` en el admin dashboard

---

## 📞 Soporte

Si tienes algún problema después de aplicar este fix:

1. Verifica que el script se ejecutó completamente sin errores
2. Revisa los logs de Postgres en Supabase Dashboard
3. Confirma que la función `is_admin()` existe y funciona
4. Prueba manualmente las funciones en el SQL Editor

---

## 🎯 Resumen Ejecutivo

| Item | Estado |
|------|--------|
| Vulnerabilidad identificada | ✅ Sí |
| Riesgo evaluado | 🔴 Alto |
| Fix desarrollado | ✅ Sí |
| Script probado | ✅ Sí |
| Impacto en código | 🟢 Ninguno |
| Requiere cambios en app | ❌ No |
| Mejora de seguridad | ✅ Crítica |

**Recomendación:** Aplicar este fix **inmediatamente** en producción.

