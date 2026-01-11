# Custom Fonts - DM Sans, Gotham, Lonely Coffee

## Fuentes Agregadas

### 1. **DM Sans** (Google Fonts)
- **Tipo:** Sans-serif moderno y limpio
- **Pesos:** 400, 500, 700
- **Uso:** Títulos, subtítulos, cuerpo de texto principal
- **Origen:** Google Fonts (cargada remotamente)

### 2. **Gotham** (Fallback: Trebuchet MS)
- **Tipo:** Geometric sans-serif
- **Característica:** Propietaria, usando alternativa system
- **Uso:** Headings, títulos principales, branding
- **Fallback:** Trebuchet MS, Arial

### 3. **Lonely Coffee** (Fallback: Courier Prime)
- **Tipo:** Monospace estilo typewriter
- **Uso:** Código, números, elementos técnicos
- **Fallback:** Courier Prime, Courier New

## Cómo Usar

### Opción 1: CSS Variables (Recomendado)

```html
<!-- HTML puro -->
<h1 style="font-family: var(--font-dm-sans);">
  Mi Título
</h1>

<h2 style="font-family: var(--font-gotham);">
  Subtítulo Gotham
</h2>

<code style="font-family: var(--font-lonely-coffee);">
  codigo_aqui()
</code>
```

### Opción 2: Tailwind CSS Classes

```html
<!-- Usando clases Tailwind -->
<h1 class="font-dm-sans text-4xl font-bold">
  Título con DM Sans
</h1>

<h2 class="font-gotham text-2xl">
  Subtítulo con Gotham
</h2>

<code class="font-lonely-coffee bg-gray-200 p-2 rounded">
  const ejemplo = true;
</code>
```

### Opción 3: En Svelte Components

```svelte
<script>
  let titulo = "Mi Título";
</script>

<h1 class="font-dm-sans text-3xl font-bold">
  {titulo}
</h1>

<p class="font-gotham">
  Párrafo con Gotham
</p>

<pre class="font-lonely-coffee">
  <code>console.log("Hola");</code>
</pre>
```

### Opción 4: Inline Styles

```svelte
<div style="font-family: var(--font-dm-sans); font-size: 24px;">
  Texto con DM Sans
</div>

<span style="font-family: var(--font-gotham); font-weight: 700;">
  Texto Gotham Bold
</span>
```

## Ejemplos Prácticos

### Landing Page Hero

```svelte
<section class="bg-kuira-black text-white p-12">
  <h1 class="font-gotham text-5xl font-bold mb-4">
    KuiraFestival
  </h1>
  <p class="font-dm-sans text-xl">
    El festival de cine más esperado del año
  </p>
  <button class="font-dm-sans font-semibold mt-6 bg-kuira-orange px-8 py-3 rounded">
    Envía tu película
  </button>
</section>
```

### Film Card

```svelte
<div class="bg-white rounded-lg shadow-lg p-6">
  <h2 class="font-gotham text-2xl mb-2">
    Título de la Película
  </h2>
  <p class="font-dm-sans text-gray-600 mb-4">
    Descripción breve de la película...
  </p>
  <div class="font-lonely-coffee text-sm text-gray-500">
    ID: 1234567890
  </div>
</div>
```

### Admin Dashboard

```svelte
<div>
  <h1 class="font-gotham text-4xl mb-6">Dashboard Admin</h1>
  
  <table class="w-full">
    <thead>
      <tr class="font-gotham font-bold">
        <th>Película</th>
        <th>Participante</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="font-dm-sans">
        <td>Mi Película</td>
        <td>Juan Pérez</td>
        <td>
          <code class="font-lonely-coffee bg-gray-200 p-1">
            EN_REVISION
          </code>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Form Input

```svelte
<form class="space-y-6">
  <div>
    <label class="font-gotham font-semibold block mb-2">
      Nombre
    </label>
    <input 
      class="font-dm-sans w-full border rounded px-4 py-2"
      placeholder="Tu nombre aquí..."
    />
  </div>
  
  <div>
    <label class="font-gotham font-semibold block mb-2">
      Descripción
    </label>
    <textarea 
      class="font-dm-sans w-full border rounded px-4 py-2"
      rows="4"
      placeholder="Describe tu película..."
    ></textarea>
  </div>
</form>
```

## Configuración de Tailwind

Las fuentes ya están configuradas en `tailwind.config.js`:

```javascript
fontFamily: {
  'dm-sans': ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
  'gotham': ['Gotham', 'Gotham SSm A', 'Gotham SSm B', 'Trebuchet MS', 'sans-serif'],
  'lonely-coffee': ['Lonely Coffee', 'Courier Prime', 'Courier New', 'monospace'],
}
```

Esto permite usar:
- `class="font-dm-sans"`
- `class="font-gotham"`
- `class="font-lonely-coffee"`

## Variables CSS

En `src/app.css` están definidas como variables:

```css
:root {
  --font-dm-sans: 'DM Sans', system-ui, -apple-system, sans-serif;
  --font-gotham: 'Gotham', 'Gotham SSm A', 'Gotham SSm B', system-ui, sans-serif;
  --font-lonely-coffee: 'Lonely Coffee', 'Courier New', monospace;
}
```

## Recomendaciones de Uso

### DM Sans - Mejor para:
- ✅ Cuerpo de texto largo
- ✅ Descripciones y párrafos
- ✅ Interfaces de usuario
- ✅ Readabilidad en pantalla
- ✅ Botones y labels

### Gotham - Mejor para:
- ✅ Títulos principales (H1, H2)
- ✅ Headings importantes
- ✅ Branding
- ✅ Impacto visual
- ✅ Secciones destacadas

### Lonely Coffee - Mejor para:
- ✅ Código
- ✅ IDs y códigos técnicos
- ✅ Monospace content
- ✅ Números secuenciales
- ✅ Elementos monoespaciados

## Carga de Fuentes

### DM Sans
- **Fuente:** Google Fonts
- **Carga:** Preconectada en `src/app.html`
- **Performance:** Optimizada con `rel="preconnect"`

### Gotham & Lonely Coffee
- **Fallbacks:** System fonts predefinidos
- **Performance:** Sin carga externa
- **Degradación:** Funciona incluso sin fuentes específicas

## Personalización

Si tienes licencia para usar Gotham real, puedes agregar @font-face en `src/fonts.css`:

```css
@font-face {
  font-family: 'Gotham';
  src: url('/fonts/Gotham-Bold.woff2') format('woff2'),
       url('/fonts/Gotham-Bold.woff') format('woff');
  font-weight: 700;
  font-display: swap;
}
```

Luego coloca los archivos en `static/fonts/`.

## Verificación

Para verificar que las fuentes están cargadas:
1. Abre DevTools (F12)
2. Ve a "Network"
3. Busca "googleapis.com"
4. Deberías ver la carga de DM Sans

O usa esta línea en la consola:
```javascript
window.getComputedStyle(document.body).fontFamily
```

## Compatibilidad

- ✅ Chrome/Edge 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Mobile (iOS 14+, Android)
- ✅ Fallbacks automáticos en navegadores antiguos

## Archivos Modificados

1. `src/app.html` - Google Fonts links
2. `src/app.css` - CSS variables
3. `src/fonts.css` - Font faces (nuevo)
4. `tailwind.config.js` - Fontfamily config

¡Listo! Ahora puedes usar las tres fuentes en tu proyecto.
