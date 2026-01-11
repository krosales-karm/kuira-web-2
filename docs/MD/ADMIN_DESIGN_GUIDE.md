# CAMBIOS PENDIENTES - DISEÑO FORMAL ADMIN KUIRA

## ✅ COMPLETADO:
1. **AdminSidebar** - Rediseñado con iconos SVG profesionales
2. **Admin Layout** - Header con gradiente y diseño formal
3. **Admin Home** - Parcialmente actualizado

## 📝 PENDIENTE POR COMPLETAR MANUALMENTE:

### 1. Terminar /admin/+page.svelte

Reemplazar todo el contenido después del header con:

```svelte
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <a
        href="/admin/participantes"
        class="block group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#C1572F] transition-all duration-300 transform hover:scale-105"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-[#C1572F] to-[#FF9498] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <svg class="w-6 h-6 text-gray-400 group-hover:text-[#C1572F] transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">Participantes</h3>
          <p class="text-gray-600 text-sm">Gestiona los participantes y sus envíos</p>
        </div>
        <div class="h-1 bg-gradient-to-r from-[#C1572F] to-[#FF9498] transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
      </a>

      <a
        href="/admin/patrocinadores"
        class="block group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#C1572F] transition-all duration-300 transform hover:scale-105"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-[#FFBD59] to-[#D18730] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <svg class="w-6 h-6 text-gray-400 group-hover:text-[#FFBD59] transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">Patrocinadores</h3>
          <p class="text-gray-600 text-sm">Administra logos y información</p>
        </div>
        <div class="h-1 bg-gradient-to-r from-[#FFBD59] to-[#D18730] transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
      </a>

      <a
        href="/admin/colaboradores"
        class="block group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#C1572F] transition-all duration-300 transform hover:scale-105"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-[#FF9498] to-[#C1572F] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <svg class="w-6 h-6 text-gray-400 group-hover:text-[#FF9498] transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">Colaboradores</h3>
          <p class="text-gray-600 text-sm">Gestiona logos y alianzas</p>
        </div>
        <div class="h-1 bg-gradient-to-r from-[#FF9498] to-[#C1572F] transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
      </a>
    </div>

    <!-- Info Card -->
    <div class="bg-gradient-to-r from-[#C1572F]/10 to-[#FF9498]/10 border border-[#C1572F]/20 rounded-2xl p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-[#C1572F] to-[#FF9498] rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-lg font-semibold text-gray-900 mb-1">Acceso Administrativo</h4>
          <p class="text-gray-700 text-sm">
            Desde este panel puedes gestionar todos los aspectos del Festival Kuira. Selecciona una sección para comenzar.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
```

Y eliminar el `<style>` al final del archivo.

## 🎨 COLORES DE KUIRA:
- Primary: `#C1572F` (Terracota)
- Secondary: `#FF9498` (Rosa salmón)
- Accent: `#FFBD59` (Amarillo dorado)  
- Dark: `#D18730` (Dorado oscuro)
- Background: `#F9FAFB` (Gris claro)
- Border: `#E5E7EB` (Gris)

## 📋 PRÓXIMOS ARCHIVOS A ACTUALIZAR:

### 2. /admin/patrocinadores/+page.svelte
- Cambiar fondo oscuro por fondo claro
- Cards con sombras suaves
- Botones con gradientes de Kuira
- Formulario con diseño formal

### 3. /admin/colaboradores/+page.svelte
- Mismo diseño que patrocinadores
- Mantener consistencia visual

### 4. /admin/participantes/+page.svelte
- Actualizar tabla con diseño formal
- Cards con información clara
- Filtros y búsqueda visualmente atractivos

## 💡 DIRECTRICES DE DISEÑO:

1. **Fondos**: Usar `bg-gray-50` o `bg-white`
2. **Cards**: `bg-white` con `shadow-sm` y `border border-gray-200`
3. **Hover**: `hover:shadow-lg` y `hover:border-[#C1572F]`
4. **Botones primarios**: `bg-gradient-to-r from-[#C1572F] to-[#FF9498]`
5. **Botones secundarios**: `bg-white` con border
6. **Textos**: 
   - Títulos: `text-gray-900`
   - Subtítulos: `text-gray-600`
   - Descripción: `text-gray-500`
7. **Iconos**: SVG con `stroke-width="2"` para líneas consistentes
8. **Bordes redondeados**: `rounded-xl` o `rounded-2xl`
9. **Transiciones**: `transition-all duration-300`
10. **Espaciado**: Usar `p-6` o `p-8` para cards

## 🚀 CARACTERÍSTICAS CLAVE:
- ✅ Diseño limpio y profesional
- ✅ Colores de la identidad Kuira
- ✅ Gradientes sutiles pero elegantes
- ✅ Sombras profesionales (no muy fuertes)
- ✅ Animaciones suaves en hover
- ✅ Iconos SVG consistentes
- ✅ Tipografía clara y legible
- ✅ Spacing generoso
- ✅ Responsive design
