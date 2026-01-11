<script lang="ts">
	const ejes = [
		{
			name: 'Kórima',
			subtitle: 'Solidaridad y resistencia colectiva',
			description: 'Explora historias de comunidad, apoyo mutuo y la fuerza que surge cuando nos unimos frente a la adversidad. El concepto rarámuri de compartir y ayudar al otro.',
			color: 'kuira-terracota',
			bgColor: 'bg-kuira-terracota/10',
			icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`
		},
		{
			name: 'Sipáachi',
			subtitle: 'Migración, identidad y pertenencia',
			description: 'Narrativas sobre el cruce de fronteras, la búsqueda de hogar y las complejidades de la identidad en un mundo en movimiento. La experiencia fronteriza desde múltiples perspectivas.',
			color: 'kuira-naranja',
			bgColor: 'bg-kuira-naranja/10',
			icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
		},
		{
			name: 'Chérame',
			subtitle: 'Resiliencia urbana y justicia social',
			description: 'Documentos y ficciones que abordan la vida en la ciudad, las luchas por la justicia y la capacidad de reinventarse. La transformación social a través de la resistencia.',
			color: 'kuira-azul',
			bgColor: 'bg-kuira-azul/10',
			icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
		}
	];
</script>

<section id="ejes" class="section-padding bg-white">
	<div class="container-kuira">
		<!-- Header -->
		<div class="text-center max-w-3xl mx-auto mb-16">
			<span class="inline-block font-lonely text-sm text-kuira-terracota uppercase tracking-widest mb-4">
				/ Ejes Temáticos
			</span>
			<h2 class="text-4xl md:text-5xl font-gotham font-bold text-kuira-azul mb-6">
				Tres pilares que guían nuestra selección
			</h2>
			<p class="text-lg text-kuira-dark/70">
				Cada obra presentada en KUIRA se enmarca en uno de estos tres ejes temáticos,
				conceptos inspirados en la lengua y filosofía rarámuri.
			</p>
		</div>

		<!-- Ejes Grid -->
		<div class="grid md:grid-cols-3 gap-8">
			{#each ejes as eje, i}
				<div
					class="eje-card group"
					style="animation-delay: {i * 0.15}s"
				>
					<!-- Icon -->
					<div class="{eje.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-{eje.color} group-hover:scale-110 transition-transform duration-300">
						{@html eje.icon}
					</div>

					<!-- Content -->
					<h3 class="font-gotham text-2xl font-bold text-kuira-azul mb-2">
						{eje.name}
					</h3>
					<p class="text-{eje.color} font-semibold text-sm uppercase tracking-wide mb-4">
						{eje.subtitle}
					</p>
					<p class="text-kuira-dark/70 leading-relaxed">
						{eje.description}
					</p>

					<!-- Decorative line -->
					<div class="mt-6 h-1 w-16 rounded-full bg-{eje.color} opacity-50 group-hover:w-full group-hover:opacity-100 transition-all duration-500"></div>
				</div>
			{/each}
		</div>

		<!-- Bottom note -->
		<p class="text-center text-kuira-dark/50 mt-12 text-sm">
			* Los nombres de los ejes provienen de la lengua rarámuri, en honor a los pueblos originarios de la Sierra Tarahumara
		</p>
	</div>
</section>
