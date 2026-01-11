# Guía de Uso: Sistema de Aceptación Legal

## 📋 Descripción General

El sistema de aceptación legal registra cuando los usuarios aceptan el **Aviso de Privacidad** y los **Términos y Condiciones** del Festival KUIRA. Esto proporciona evidencia legal de consentimiento y cumple con las regulaciones de protección de datos (LFPDPPP).

## 🗄️ Estructura de la Tabla

### `user_legal_acceptance`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único de la aceptación |
| `user_id` | UUID | ID del usuario (referencia a `auth.users`) |
| `document_type` | VARCHAR(50) | Tipo: `'privacy_policy'`, `'terms_conditions'`, `'both'` |
| `document_version` | VARCHAR(20) | Versión del documento (ej: `'1.0'`) |
| `accepted_at` | TIMESTAMP | Fecha y hora de aceptación |
| `ip_address` | INET | IP desde donde se aceptó (opcional) |
| `user_agent` | TEXT | Navegador/dispositivo usado (opcional) |
| `acceptance_context` | VARCHAR(100) | Contexto: `'profile_creation'`, `'film_submission'`, etc. |
| `created_at` | TIMESTAMP | Fecha de creación del registro |

## 🚀 Instalación

1. **Ejecuta el script SQL** en el SQL Editor de Supabase:
   ```bash
   # Archivo: docs/SQL/USER_LEGAL_ACCEPTANCE.sql
   ```

2. **Verifica la instalación**:
   ```sql
   SELECT * FROM user_legal_acceptance LIMIT 1;
   ```

## 💻 Uso en el Código

### 1. Registrar Aceptación

El código ya está integrado en el formulario de perfil. Cuando el usuario guarda su perfil con el checkbox marcado:

```typescript
// En handleSubmit() del formulario de perfil
const { error: legalError } = await supabase.rpc('record_legal_acceptance', {
  p_document_type: 'both',
  p_document_version: '1.0',
  p_acceptance_context: 'profile_creation'
});
```

### 2. Verificar si Usuario Aceptó Términos

```typescript
// Verificar aceptación
const { data, error } = await supabase.rpc('has_accepted_legal_documents', {
  p_user_id: user.id,
  p_document_type: 'both',
  p_document_version: '1.0'
});

if (data === true) {
  console.log('Usuario ha aceptado los términos');
}
```

### 3. Obtener Historial de Aceptaciones

```typescript
// Ver aceptaciones del usuario actual
const { data, error } = await supabase
  .from('user_legal_acceptance')
  .select('*')
  .order('accepted_at', { ascending: false });
```

## 📊 Funciones Disponibles

### `record_legal_acceptance()`

Registra una nueva aceptación o actualiza una existente.

**Parámetros:**
- `p_document_type`: Tipo de documento (`'privacy_policy'`, `'terms_conditions'`, `'both'`)
- `p_document_version`: Versión del documento (default: `'1.0'`)
- `p_ip_address`: IP del usuario (opcional)
- `p_user_agent`: User agent del navegador (opcional)
- `p_acceptance_context`: Contexto de la aceptación (opcional)

**Retorna:** UUID del registro creado/actualizado

**Ejemplo:**
```sql
SELECT public.record_legal_acceptance(
    'both',
    '1.0',
    '192.168.1.100'::INET,
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    'profile_creation'
);
```

### `has_accepted_legal_documents()`

Verifica si un usuario ha aceptado los documentos legales.

**Parámetros:**
- `p_user_id`: ID del usuario (default: usuario actual)
- `p_document_type`: Tipo a verificar (default: `'both'`)
- `p_document_version`: Versión a verificar (default: `'1.0'`)

**Retorna:** BOOLEAN (true si ha aceptado, false si no)

**Ejemplo:**
```sql
-- Verificar usuario actual
SELECT public.has_accepted_legal_documents();

-- Verificar usuario específico
SELECT public.has_accepted_legal_documents(
    'user-uuid-here',
    'both',
    '1.0'
);
```

## 🔒 Seguridad (RLS)

Las políticas de Row Level Security están configuradas:

1. **Usuarios autenticados** pueden:
   - Ver sus propias aceptaciones
   - Insertar sus propias aceptaciones

2. **Administradores** pueden:
   - Ver todas las aceptaciones de todos los usuarios

## 📈 Reportes Administrativos

### Vista: `user_legal_acceptance_report`

Proporciona un reporte completo con información del usuario:

```sql
SELECT * FROM public.user_legal_acceptance_report
ORDER BY accepted_at DESC
LIMIT 50;
```

Incluye:
- Email del usuario
- Nombre completo
- Tipo de documento aceptado
- Fecha de aceptación
- Contexto de aceptación
- IP address

## 🔄 Flujo de Trabajo

### Creación de Perfil

1. Usuario llena formulario de perfil
2. Marca checkbox de aceptación (Paso 5)
3. Click en "Guardar Perfil"
4. Sistema:
   - Guarda datos del perfil
   - Registra aceptación legal con contexto `'profile_creation'`
   - Redirige a "Mis Películas"

### Envío de Película (Futuro)

Cuando se implemente el envío de películas:

```typescript
// Registrar aceptación antes de permitir envío
const { data } = await supabase.rpc('record_legal_acceptance', {
  p_document_type: 'both',
  p_document_version: '1.0',
  p_acceptance_context: 'film_submission'
});
```

## 🔍 Consultas Útiles

### Ver todas las aceptaciones de hoy
```sql
SELECT * FROM user_legal_acceptance
WHERE DATE(accepted_at) = CURRENT_DATE
ORDER BY accepted_at DESC;
```

### Contar usuarios que han aceptado términos
```sql
SELECT 
    document_type,
    COUNT(DISTINCT user_id) as total_users
FROM user_legal_acceptance
GROUP BY document_type;
```

### Usuarios sin aceptación registrada
```sql
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN user_legal_acceptance ula ON u.id = ula.user_id
WHERE ula.id IS NULL;
```

### Últimas 100 aceptaciones con detalles
```sql
SELECT * FROM user_legal_acceptance_report
LIMIT 100;
```

## ⚠️ Consideraciones Importantes

1. **Versiones**: Cuando cambien los términos, incrementa la versión (ej: `'1.0'` → `'2.0'`)
2. **Re-aceptación**: Si cambias la versión, usuarios deberán aceptar nuevamente
3. **Auditoría**: Todos los registros incluyen timestamp y son inmutables (solo INSERT/UPDATE, no DELETE)
4. **GDPR/LFPDPPP**: Esta tabla proporciona evidencia de consentimiento explícito
5. **IP y User Agent**: Son opcionales pero recomendados para auditoría legal

## 🆕 Actualización de Términos

Cuando actualices los términos legales:

1. **Actualiza la versión** en el código:
   ```typescript
   p_document_version: '2.0'  // Nueva versión
   ```

2. **Verifica usuarios con versión antigua**:
   ```sql
   SELECT * FROM user_legal_acceptance
   WHERE document_version != '2.0';
   ```

3. **Implementa modal de re-aceptación** para usuarios existentes

## 📞 Soporte

Para dudas sobre la implementación:
- Revisa el archivo SQL: `/docs/SQL/USER_LEGAL_ACCEPTANCE.sql`
- Consulta el código del formulario: `/src/routes/participantes/perfil/+page.svelte`
- Contacta al equipo técnico de KUIRA
