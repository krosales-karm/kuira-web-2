# Sección de Convocatoria - KuiraFestival

## Descripción General

La sección de convocatoria permite a los usuarios participantes enviar sus proyectos cinematográficos a KuiraFestival. El sistema gestiona la recepción, almacenamiento y seguimiento de los envíos.

## Rutas Disponibles

### 1. `/convocatoria` - Página Principal
**Acceso:** Público (sin autenticación requerida)

Muestra:
- Información general de la convocatoria
- Fechas de apertura y cierre
- Categorías de participación:
  - Largometraje (60-180 min)
  - Cortometraje (1-59 min)
  - Documental (1-180 min)
- Requisitos para participar
- Beneficios de participación
- Botón dinámico que cambia según:
  - Convocatoria cerrada → "Convocatoria Cerrada"
  - Convocatoria abierta + NO autenticado → "Regístrate para Enviar"
  - Convocatoria abierta + autenticado → "Enviar mi Proyecto"

### 2. `/convocatoria/envios` - Enviar Proyecto
**Acceso:** Solo usuarios autenticados
**Redirección:** Si no está autenticado → `/signup`

Formulario para enviar proyectos con campos:
- **Título** (requerido)
- **Categoría** (requerido) - desplegable
- **Duración en minutos** (requerido)
- **Sinopsis** (requerido)
- **Director/a**
- **País de Origen**
- **Año de Producción**

Validaciones:
- Todos los campos requeridos deben completarse
- La duración debe ser mayor a 0
- La sinopsis no puede estar vacía
- Previene duplicados: un usuario no puede enviar dos proyectos con el mismo título

**Flujo:**
1. Usuario completa el formulario
2. Se valida en cliente
3. Se envía a Supabase tabla `envios`
4. Estado inicial: `pendiente`
5. Redirección automática a `/convocatoria/mis-envios` después de 2 segundos

### 3. `/convocatoria/mis-envios` - Mis Proyectos
**Acceso:** Solo usuarios autenticados
**Redirección:** Si no está autenticado → `/signup`

Muestra:
- Listado de todos los envíos del usuario
- Para cada envío:
  - Título y categoría
  - Duración
  - Sinopsis completa
  - Director, país y año
  - Estado (Pendiente/Aceptado/Rechazado)
  - Fecha de envío
  - Link a detalles
- Botón para enviar nuevo proyecto
- Mensaje si no hay envíos: "No hay envíos aún"

Estados posibles:
- 🟡 **Pendiente** - En evaluación
- 🟢 **Aceptado** - Proyecto seleccionado
- 🔴 **Rechazado** - No fue seleccionado

## Modelo de Base de Datos

### Tabla: `envios`

```sql
CREATE TABLE envios (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (FK to auth.users),
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL (largometraje/cortometraje/documental),
  duracion INTEGER NOT NULL,
  sinopsis TEXT NOT NULL,
  director TEXT,
  pais_origen TEXT,
  anio INTEGER,
  estado TEXT DEFAULT 'pendiente' (pendiente/aceptado/rechazado),
  archivo_path TEXT,
  archivo_url TEXT,
  notas_admin TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, titulo)
);
```

Índices:
- `user_id` - Para consultas por usuario
- `estado` - Para filtrar por estado
- `created_at DESC` - Para ordenamiento

## Row Level Security (RLS)

### Políticas Implementadas

#### Para Participantes (sin grupo admin):
- **SELECT**: Ver solo sus propios envíos
- **INSERT**: Crear solo sus propios envíos
- **UPDATE**: Actualizar solo envíos en estado `pendiente`
- **DELETE**: No permitido

#### Para Admins (grupo admin):
- **SELECT**: Ver todos los envíos
- **UPDATE**: Actualizar cualquier envío (para cambiar estado o agregar notas)

## Configuración Requerida en Supabase

### 1. Ejecutar el Script SQL
En Supabase SQL Editor, ejecutar: `/docs/SETUP_ENVIOS.sql`

Esto crea:
- Tabla `envios`
- Índices
- Políticas RLS
- Trigger para `updated_at`

### 2. Actualizar Variables de Entorno (si es necesario)
Si necesitas URLs públicas de archivos, agregar en `.env`:
```
VITE_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1/object/public/envios
```

## Flujo de Participación Completo

```
1. Usuario sin cuenta
   ↓
2. Visita /convocatoria
   ↓
3. Hace clic en "Regístrate para Enviar"
   ↓
4. Se registra en /signup (magic link)
   ↓
5. Vuelve a /convocatoria
   ↓
6. Hace clic en "Enviar mi Proyecto"
   ↓
7. Completa formulario en /convocatoria/envios
   ↓
8. Envío se guarda en DB con estado 'pendiente'
   ↓
9. Ve su proyecto en /convocatoria/mis-envios
   ↓
10. Admin revisa y cambia estado a 'aceptado' o 'rechazado'
   ↓
11. Usuario ve actualización del estado
```

## Funcionalidades Futuras

- [ ] Subida de archivos de video
- [ ] Vista previa de video
- [ ] Sistema de comentarios admin/participante
- [ ] Notificaciones por cambio de estado
- [ ] Descarga de documentos requeridos (guía, términos)
- [ ] Cálculo automático de duración desde video
- [ ] Búsqueda avanzada en admin
- [ ] Exportar listado de envíos (CSV/PDF)

