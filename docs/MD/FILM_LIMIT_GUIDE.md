# Límite de 2 Films por Participante

## Descripción
Este sistema implementa una restricción que permite que cada participante envíe máximo **2 películas**.

## Implementación

### 1. Nivel de Base de Datos (Trigger)
**Archivo:** `/docs/FILM_UPLOAD_LIMIT.sql`

- **Función:** `check_film_limit()`
- **Trigger:** `check_film_limit_trigger`
- **Comportamiento:** Rechaza la inserción si el participante ya tiene 2 películas
- **Ventajas:** 
  - Imposible de eludir incluso si alguien hackea el frontend
  - Se aplica automáticamente
  - Garantizado a nivel de BD

**Cómo ejecutarlo:**
1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `FILM_UPLOAD_LIMIT.sql`
3. Ejecuta (Ctrl+Enter)

### 2. Nivel de Frontend (UX)
**Archivo:** `/src/routes/participantes/mis-peliculas/+page.svelte`

**Cambios realizados:**
- Variables de estado: `filmCount`, `maxFilms`, `canUploadMore`
- Widget informativo que muestra: "X de 2 películas enviadas"
- Botón deshabilitado cuando se alcanza el límite
- Validación en `handleSubmit()` que rechaza nuevas películas si se alcanzó el límite
- Permite editar películas existentes sin límite

**Funcionalidades:**
```
✓ Muestra contador visual: "0 de 2", "1 de 2", "2 de 2"
✓ Color verde cuando puede subir más
✓ Color rojo cuando alcanzó el límite
✓ Botón "+ Agregar Película" se deshabilita automáticamente
✓ Permite editar/eliminar películas existentes
✓ Mensaje claro sobre el límite
```

## Vistas y Funciones Útiles

### Ver películas por participante
```sql
SELECT * FROM participant_film_count 
ORDER BY film_count DESC;
```

### Contar películas de un usuario
```sql
SELECT * FROM public.get_user_film_limit('user-id-here'::UUID);
```

### Ver películas de un participante
```sql
SELECT id, title, status FROM public.films 
WHERE participant_id = 'user-id-here'::UUID;
```

## Panel Admin: Funciones Especiales

### Ver todos los participantes y cuántas películas tiene cada uno
```sql
SELECT * FROM participant_film_count;
```

### Resetear películas de un participante (SOLO ADMIN)
```sql
SELECT * FROM public.reset_participant_films('user-id-here'::UUID, 'Razón del reset');
```

**Nota:** Solo funciona si quién lo ejecuta es admin. El sistema verifica que tenga el grupo 'admin'.

## Modificar el Límite

Si necesitas cambiar de 2 a otro número (ej: 3, 5, 10):

**En la BD:**
```sql
-- En la función check_film_limit()
max_films INTEGER := 2;  -- Cambiar este número
```

**En el Frontend:**
```typescript
let maxFilms = 2;  // Cambiar este número
```

## Flujo de Usuario

```
1. Usuario entra a "Mis Películas"
   ↓
2. Ve mensaje: "0 de 2 películas enviadas"
   ↓
3. Hizo clic en "+ Agregar Película"
   ↓
4. Completa formulario y sube primera película
   ↓
5. Ahora ve: "1 de 2 películas enviadas - Puedes subir 1 más"
   ↓
6. Sube segunda película
   ↓
7. Ahora ve: "2 de 2 películas enviadas ⚠️"
   ↓
8. Botón "+ Agregar Película" está deshabilitado
   ↓
9. Puede editar o eliminar películas existentes
   ↓
10. Si intenta hackear el API:
    - El trigger en BD rechaza la inserción
    - Error: "Límite de películas alcanzado"
```

## Casos Especiales

### ¿Qué pasa si un participante elimina una película?
- El contador se actualiza automáticamente
- Puede volver a subir si tiene espacio

### ¿Qué pasa si un admin le asigna más películas?
- El trigger NO se aplica a admins
- Solo se aplica a inserciones normales de participantes

### ¿Puedo permitir que un participante suba más películas?
- Opción 1: Modificar `maxFilms` a un número mayor
- Opción 2: Usar `reset_participant_films()` para eliminar todas y que comience de cero
- Opción 3: Actualizar directamente en BD (no recomendado)

## Monitoreo

### Ver auditoría de cambios de películas
```sql
SELECT * FROM group_audit_log 
WHERE action LIKE '%film%'
ORDER BY created_at DESC 
LIMIT 50;
```

## Seguridad

La restricción se implementa en **3 niveles**:

| Nivel | Mecanismo | Seguridad |
|-------|-----------|-----------|
| **Frontend** | Botón deshabilitado, validación | Previene acciones accidentales |
| **API** | Validación en handleSubmit() | Detiene requests malintencionados |
| **BD** | Trigger SQL | IMPOSIBLE de eludir ✓ |

Incluso si alguien:
- Modifica el HTML del navegador
- Hackea el API
- Intenta insertar directamente en la BD

**El trigger lo detendrá automáticamente.**

## Error Message

Si un usuario intenta exceder el límite, verá:
```
"Límite de películas alcanzado. Máximo permitido: 2"
```

## Instalación Paso a Paso

### 1. Ejecutar SQL en Supabase
```bash
# Copiar contenido de /docs/FILM_UPLOAD_LIMIT.sql
# Pegar en Supabase SQL Editor
# Ejecutar
```

### 2. El frontend ya está actualizado
```bash
# Los cambios ya están en git
# Solo necesitas hacer pull
git pull origin main
```

### 3. Verificar
```bash
# 1. Abre tu app
# 2. Ve a "Mis Películas"
# 3. Deberías ver el contador: "0 de 2"
# 4. Completa el flujo para verificar
```

## Preguntas Frecuentes

**P: ¿Se puede editar una película ya subida?**
A: Sí, editar no cuenta como nueva película. La restricción solo aplica a inserciones.

**P: ¿Se puede eliminar y volver a subir?**
A: Sí, al eliminar liberas un espacio. Es como si la película nunca hubiera existido.

**P: ¿Los admins pueden subir infinitas películas?**
A: Sí, el trigger solo se aplica a participantes normales. Los admins pueden subir infinitas.

**P: ¿Cómo sabemos cuándo se alcanzó el límite?**
A: El contador visual lo muestra. Además, hay auditoría en `group_audit_log`.

**P: ¿Puedo permitir excepciones?**
A: Sí, usa `reset_participant_films()` para limpiar el historial de un usuario.
