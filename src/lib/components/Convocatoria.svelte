<script lang="ts">
	let { openRegistro }: { openRegistro: () => void } = $props();

	const timeline = [
		{ date: '13 Ene 2026', event: 'Apertura de convocatoria', status: 'active' },
		{ date: '28 Feb 2026', event: 'Cierre de inscripciones', status: 'upcoming' },
		{ date: '7 Mar 2026', event: 'Anuncio de selección oficial', status: 'upcoming' },
		{ date: '18 Abril 2026 a 3 Mayo 2026', event: 'Festival KUIRA', status: 'upcoming' }
	];
</script>

<section id="convocatoria" class="section-padding bg-kuira-azul relative overflow-hidden">
	<!-- Background decoration -->
	<div class="absolute inset-0 opacity-10">
		<img src="/images/patterns/patron-03.svg" alt="" class="w-full h-full object-cover" />
	</div>

	<div class="container-kuira relative z-10">
		<div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
			<!-- Content -->
			<div class="text-white">
				<span class="inline-block font-lonely text-sm text-kuira-oro uppercase tracking-widest mb-4">
					/ Convocatoria 2026
				</span>
				<h2 class="text-4xl md:text-5xl font-gotham font-bold mb-6">
					¡La convocatoria está abierta!
				</h2>
				<p class="text-xl text-white/80 mb-8">
					Invitamos a cineastas, colectivos audiovisuales, estudiantes y realizadores
					nacionales e internacionales a participar en la primera edición del Festival KUIRA.
				</p>

				<!-- Timeline -->
				<div class="space-y-4 mb-10">
					{#each timeline as item}
						<div class="flex items-center gap-4">
							<div class="w-3 h-3 rounded-full {item.status === 'active' ? 'bg-kuira-oro animate-pulse' : 'bg-white/30'}"></div>
							<div class="flex-1">
								<span class="font-lonely text-kuira-oro text-sm">{item.date}</span>
								<p class="text-white/90 font-medium">{item.event}</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-4">
					<button
						type="button"
						onclick={openRegistro}
						class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-kuira-oro text-kuira-azul font-gotham font-bold rounded-full hover:bg-kuira-naranja hover:text-white transition-all duration-300 cursor-pointer"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
						Participa en el Registro
					</button>
					<a
						href="/Convocatoria.pdf"
						target="_blank"
						class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-gotham font-bold rounded-full hover:bg-white hover:text-kuira-azul transition-all duration-300"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						Descargar Bases
					</a>
				</div>
			</div>

			<!-- Info Cards -->
			<div class="space-y-6">
				<!-- Who can participate -->
				<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
					<h3 class="font-gotham text-xl font-bold text-white mb-4 flex items-center gap-3">
						<span class="w-8 h-8 bg-kuira-oro/20 rounded-lg flex items-center justify-center">
							<svg class="w-4 h-4 text-kuira-oro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</span>
						¿Quiénes pueden participar?
					</h3>
					<ul class="space-y-2 text-white/80">
						<li class="flex items-start gap-2">
							<span class="text-kuira-oro mt-1">•</span>
							Cineastas locales, estatales e internacionales
						</li>
						<li class="flex items-start gap-2">
							<span class="text-kuira-oro mt-1">•</span>
							Colectivos audiovisuales
						</li>
						<li class="flex items-start gap-2">
							<span class="text-kuira-oro mt-1">•</span>
							Estudiantes de cine y artes visuales
						</li>
						<li class="flex items-start gap-2">
							<span class="text-kuira-oro mt-1">•</span>
							Realizadores independientes
						</li>
					</ul>
				</div>

				<!-- Requirements -->
				<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
					<h3 class="font-gotham text-xl font-bold text-white mb-4 flex items-center gap-3">
						<span class="w-8 h-8 bg-kuira-rosa/20 rounded-lg flex items-center justify-center">
							<svg class="w-4 h-4 text-kuira-rosa" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</span>
						Requisitos Técnicos
					</h3>
					<div class="grid grid-cols-2 gap-4 text-white/80">
						<div>
							<p class="text-kuira-oro text-sm font-semibold">Duración máx.</p>
							<p>90 minutos</p>
						</div>
						<div>
							<p class="text-kuira-oro text-sm font-semibold">Formatos</p>
							<p>MP4, MOV, MKV</p>
						</div>
						<div>
							<p class="text-kuira-oro text-sm font-semibold">Obras por autor</p>
							<p>Máximo 2</p>
						</div>
						<div>
							<p class="text-kuira-oro text-sm font-semibold">Idioma</p>
							<p>Subtítulos en español</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
