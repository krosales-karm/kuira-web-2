<script lang="ts">
	const categorias = [
		{
			title: 'Cortometraje',
			duration: 'Hasta 30 minutos',
			description: 'Obras cortas que capturan historias poderosas en formato condensado.',
			icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>`,
			features: ['Documental', 'Ficción', 'Animación', 'Experimental']
		},
		{
			title: 'Largometraje',
			duration: '60 minutos o más',
			description: 'Narrativas extensas que profundizan en las temáticas del festival.',
			icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`,
			features: ['Documental', 'Ficción', 'Cine de autor', 'Ópera prima']
		}
	];

	const reconocimientos = [
		'Certificado de participación oficial',
		'Proyección en múltiples sedes de Ciudad Juárez',
		'Cobertura en medios locales y regionales',
		'Inclusión en catálogo digital del festival',
		'Networking con cineastas y productores',
		'Posibilidad de mesas de discusión con el público'
	];
</script>

<section id="categorias" class="section-padding bg-kuira-cream">
	<div class="container-kuira">
		<!-- Header -->
		<div class="text-center max-w-3xl mx-auto mb-16">
			<span class="inline-block font-lonely text-sm text-kuira-terracota uppercase tracking-widest mb-4">
				/ Categorías
			</span>
			<h2 class="text-4xl md:text-5xl font-gotham font-bold text-kuira-azul mb-6">
				Categorías de Participación
			</h2>
			<p class="text-lg text-kuira-dark/70">
				Dos categorías abiertas para todo tipo de géneros cinematográficos
				que aborden los ejes temáticos del festival.
			</p>
		</div>

		<!-- Categories -->
		<div class="grid md:grid-cols-2 gap-8 mb-20">
			{#each categorias as cat}
				<div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div class="flex items-start gap-6">
						<div class="w-20 h-20 bg-kuira-naranja/10 rounded-2xl flex items-center justify-center text-kuira-naranja shrink-0">
							{@html cat.icon}
						</div>
						<div class="flex-1">
							<h3 class="font-gotham text-2xl font-bold text-kuira-azul mb-1">
								{cat.title}
							</h3>
							<p class="text-kuira-naranja font-semibold mb-3">{cat.duration}</p>
							<p class="text-kuira-dark/70 mb-4">{cat.description}</p>
							<div class="flex flex-wrap gap-2">
								{#each cat.features as feature}
									<span class="px-3 py-1 bg-kuira-cream rounded-full text-sm text-kuira-azul font-medium">
										{feature}
									</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Reconocimientos -->
		<div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
			<div class="grid lg:grid-cols-2 gap-10 items-center">
				<div>
					<span class="inline-block font-lonely text-sm text-kuira-mostaza uppercase tracking-widest mb-4">
						/ Reconocimientos
					</span>
					<h3 class="text-3xl font-gotham font-bold text-kuira-azul mb-4">
						Beneficios para participantes seleccionados
					</h3>
					<p class="text-kuira-dark/70 mb-6">
						Todos los cineastas cuyas obras sean seleccionadas para la muestra oficial
						recibirán los siguientes beneficios:
					</p>
				</div>
				<div class="grid sm:grid-cols-2 gap-4">
					{#each reconocimientos as item}
						<div class="flex items-start gap-3">
							<div class="w-6 h-6 bg-kuira-oro/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
								<svg class="w-3 h-3 text-kuira-oro" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
								</svg>
							</div>
							<span class="text-kuira-dark/80 text-sm">{item}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
