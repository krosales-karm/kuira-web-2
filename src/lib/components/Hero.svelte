<script lang="ts">
	let { openRegistro }: { openRegistro: () => void } = $props();
</script>

<section class="relative min-h-screen flex items-center overflow-hidden">
	<!-- Fondo naranja lado izquierdo -->
	<div class="absolute inset-0 bg-kuira-naranja"></div>

	<!-- Background Image - Solo mitad derecha -->
	<div class="absolute top-0 right-0 w-1/2 h-full hidden md:block">
		<img
			src="/images/logos/Juarez.jpg"
			alt=""
			class="w-full h-full object-cover"
		/>
		<!-- Overlay suave -->
		<div class="absolute inset-0 bg-kuira-naranja/40"></div>
		<!-- Gradiente de transición -->
		<div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-kuira-naranja to-transparent"></div>
	</div>

	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0 pattern-bg"></div>
	</div>

	<!-- Decorative Elements -->
	<div class="absolute top-20 left-10 w-32 h-32 bg-kuira-oro rounded-full opacity-20 blur-3xl"></div>
	<div class="absolute bottom-20 right-10 w-48 h-48 bg-kuira-terracota rounded-full opacity-20 blur-3xl"></div>

	<!-- Contenido centrado en la mitad izquierda -->
	<div class="absolute inset-y-0 left-0 w-full md:w-1/2 flex items-center justify-center z-10">
		<div class="text-center flex flex-col items-center px-6">
			<!-- Logo -->
			<div class="mb-8 animate-fadeInUp">
				<img
					src="/images/logos/logo.png"
					alt="KUIRA"
					class="h-32 md:h-48 lg:h-56 drop-shadow-2xl"
				/>
			</div>

			<!-- Tagline -->
			<!-- <h1 class="font-gotham text-3xl md:text-5xl lg:text-6xl font-bold text-kuira-azul mb-6 animate-fadeInUp" style="animation-delay: 0.2s">
				FESTIVAL DE CINE FRONTERIZO
			</h1> -->

			<p class="text-lg md:text-xl text-kuira-azul/80 max-w-2xl mb-4 animate-fadeInUp" style="animation-delay: 0.3s">
				Ciudad Juárez, Chihuahua
			</p>

			<p class="text-xl md:text-2xl text-white font-semibold mb-10 animate-fadeInUp" style="animation-delay: 0.4s">
				Primera Edición - Abril 2026
			</p>

			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style="animation-delay: 0.5s">
				<button onclick={openRegistro} class="btn-primary text-lg px-8 py-4">
					Convocatoria 2026 Abierta
				</button>
				<a href="#nosotros" class="btn-secondary border-white text-white hover:bg-white hover:text-kuira-azul text-lg px-8 py-4">
					Conoce más
				</a>
			</div>

			<!-- Dates Badge -->
			<div class="mt-12 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 animate-fadeInUp" style="animation-delay: 0.6s">
				<span class="w-2 h-2 bg-kuira-oro rounded-full animate-pulse"></span>
				<span class="font-dm-sans text-white font-medium">
					Inscripciones: 13 Ene 2026 - 28 Feb 2026
				</span>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator (centrado en mitad izquierda en desktop) -->
	<div class="absolute bottom-8 left-1/2 md:left-1/4 transform -translate-x-1/2 animate-bounce z-10">
		<a href="#nosotros" class="text-white/60 hover:text-white transition-colors" aria-label="Scroll down">
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
			</svg>
		</a>
	</div>
</section>
