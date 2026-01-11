<script lang="ts">
	import { enviarContacto } from '$lib/supabase/contacto';

	let formData = $state({
		nombre: '',
		email: '',
		asunto: '',
		mensaje: ''
	});

	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
			errorMessage = 'Por favor completa todos los campos';
			submitStatus = 'error';
			return;
		}

		isSubmitting = true;
		errorMessage = '';

		try {
			const result = await enviarContacto(formData);

			if (result.success) {
				submitStatus = 'success';
				formData = {
					nombre: '',
					email: '',
					asunto: '',
					mensaje: ''
				};
			} else {
				errorMessage = result.error || 'Error al enviar el mensaje';
				submitStatus = 'error';
			}
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Error desconocido';
			submitStatus = 'error';
		} finally {
			isSubmitting = false;
		}
	}

	const contactInfo = [
		{
			icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
			label: 'Email',
			value: 'contacto@kuirafestival.com',
			href: 'mailto:contacto@kuirafestival.com'
		},
		{
			icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>`,
			label: 'Teléfono',
			value: '(656) 213 6304',
			href: 'tel:+526562136304'
		},
		{
			icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
			label: 'Ubicación',
			value: 'Ciudad Juárez, Chihuahua',
			href: null
		}
	];

	const socials = [
		{
			name: 'Instagram',
			icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
			href: 'https://www.instagram.com/festivalkuira/'
		}
		// ,
		// {
		// 	name: 'Facebook',
		// 	icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
		// 	href: 'https://facebook.com/kuirafestival'
		// },
		// {
		// 	name: 'TikTok',
		// 	icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
		// 	href: 'https://tiktok.com/@kuirafestival'
		// }
	];
</script>

<section id="contacto" class="section-padding bg-white">
	<div class="container-kuira">
		<div class="grid lg:grid-cols-2 gap-12 lg:gap-20">
			<!-- Contact Info -->
			<div>
				<span class="inline-block font-lonely text-sm text-kuira-terracota uppercase tracking-widest mb-4">
					/ Contacto
				</span>
				<h2 class="text-4xl md:text-5xl font-gotham font-bold text-kuira-azul mb-6">
					¿Tienes preguntas?
				</h2>
				<p class="text-lg text-kuira-dark/70 mb-10">
					Estamos aquí para ayudarte. Contáctanos para resolver cualquier duda
					sobre la convocatoria, alianzas o patrocinios.
				</p>

				<!-- Contact Items -->
				<div class="space-y-6 mb-10">
					{#each contactInfo as item}
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 bg-kuira-naranja/10 rounded-xl flex items-center justify-center text-kuira-naranja">
								{@html item.icon}
							</div>
							<div>
								<p class="text-sm text-kuira-dark/50 font-medium">{item.label}</p>
								{#if item.href}
									<a href={item.href} class="text-kuira-azul font-semibold hover:text-kuira-terracota transition-colors">
										{item.value}
									</a>
								{:else}
									<p class="text-kuira-azul font-semibold">{item.value}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- Alianzas CTA -->
				<div class="bg-kuira-cream rounded-2xl p-6">
					<h4 class="font-gotham font-bold text-kuira-azul mb-2">¿Interesado en ser patrocinador?</h4>
					<p class="text-kuira-dark/70 text-sm mb-4">
						Contamos con diferentes niveles de patrocinio para empresas que deseen apoyar la cultura fronteriza.
					</p>
					<a href="mailto:alianzas@kuirafestival.com" class="text-kuira-naranja font-semibold text-sm hover:text-kuira-terracota transition-colors">
						alianzas@kuirafestival.com →
					</a>
				</div>
			</div>

			<!-- Contact Form -->
			<div class="bg-kuira-azul rounded-3xl p-8 md:p-10">
				{#if submitStatus === 'success'}
					<div class="text-center py-8">
						<div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h3 class="font-gotham text-2xl font-bold text-white mb-3">¡Mensaje enviado!</h3>
						<p class="text-white/70 mb-6">Gracias por contactarnos. Te responderemos lo antes posible.</p>
						<button
							onclick={() => submitStatus = 'idle'}
							class="px-6 py-3 bg-kuira-oro text-kuira-azul font-gotham font-bold rounded-xl hover:bg-kuira-naranja hover:text-white transition-all duration-300"
						>
							Enviar otro mensaje
						</button>
					</div>
				{:else}
					<h3 class="font-gotham text-2xl font-bold text-white mb-6">
						Envíanos un mensaje
					</h3>
					<form onsubmit={handleSubmit} class="space-y-5">
						<div>
							<label for="contact-name" class="block text-white/70 text-sm mb-2">Nombre completo *</label>
							<input
								type="text"
								id="contact-name"
								bind:value={formData.nombre}
								required
								class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-kuira-oro transition-colors"
								placeholder="Tu nombre"
							/>
						</div>
						<div>
							<label for="contact-email" class="block text-white/70 text-sm mb-2">Email *</label>
							<input
								type="email"
								id="contact-email"
								bind:value={formData.email}
								required
								class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-kuira-oro transition-colors"
								placeholder="tu@email.com"
							/>
						</div>
						<div>
							<label for="contact-subject" class="block text-white/70 text-sm mb-2">Asunto *</label>
							<select
								id="contact-subject"
								bind:value={formData.asunto}
								required
								class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-kuira-oro transition-colors"
							>
								<option value="" class="text-kuira-dark">Selecciona un asunto</option>
								<option value="convocatoria" class="text-kuira-dark">Dudas sobre convocatoria</option>
								<option value="patrocinio" class="text-kuira-dark">Patrocinios y alianzas</option>
								<option value="prensa" class="text-kuira-dark">Prensa y medios</option>
								<option value="otro" class="text-kuira-dark">Otro</option>
							</select>
						</div>
						<div>
							<label for="contact-message" class="block text-white/70 text-sm mb-2">Mensaje *</label>
							<textarea
								id="contact-message"
								bind:value={formData.mensaje}
								required
								rows="4"
								class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-kuira-oro transition-colors resize-none"
								placeholder="Escribe tu mensaje..."
							></textarea>
						</div>
						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full py-4 bg-kuira-oro text-kuira-azul font-gotham font-bold rounded-xl hover:bg-kuira-naranja hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if isSubmitting}
								<svg class="animate-spin -ml-1 mr-2 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Enviando...
							{:else}
								Enviar mensaje
							{/if}
						</button>
						{#if submitStatus === 'error'}
							<p class="text-center text-red-400 text-sm">
								{errorMessage || 'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.'}
							</p>
						{/if}
					</form>
				{/if}
			</div>
		</div>

		<!-- Social Links -->
		<div class="mt-16 pt-10 border-t border-kuira-dark/10 flex flex-col sm:flex-row items-center justify-between gap-6">
			<p class="text-kuira-dark/60">Síguenos en redes sociales</p>
			<div class="flex items-center gap-4">
				{#each socials as social}
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						class="w-10 h-10 bg-kuira-azul/5 rounded-full flex items-center justify-center text-kuira-azul hover:bg-kuira-azul hover:text-white transition-all duration-300"
						aria-label={social.name}
					>
						{@html social.icon}
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
