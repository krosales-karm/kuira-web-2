<script lang="ts">
	import { crearRegistro } from '$lib/supabase/registro';

	let { isOpen = $bindable(false) } = $props();

	let formData = $state({
		// Información personal
		email: '',
		nombreCompleto: '',
		nombreColectivo: '',
		telefono: '',
		sitioWeb: '',
		nacionalidad: '',
		// Ubicación
		pais: '',
		ciudad: '',
		// Profesional
		rol: '',
		biografia: '',
		// Datos de la obra
		titulo: '',
		categoria: '',
		tema: '',
		duracion: '',
		anoProduccion: '',
		idiomaPrincipal: '',
		formatoVideo: '',
		tieneSubtitulos: '',
		sinopsis: ''
	});

	let caratulaFile = $state<File | null>(null);
	let videoFile = $state<File | null>(null);
	let aceptaTerminos = $state(false);
	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	function closeModal() {
		isOpen = false;
		setTimeout(() => {
			submitStatus = 'idle';
		}, 300);
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
		}
	}

	function formatTelefono(value: string): string {
		const digits = value.replace(/\D/g, '').slice(0, 10);
		if (digits.length <= 3) return digits;
		if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
		return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
	}

	function handleTelefonoInput(e: Event) {
		const input = e.target as HTMLInputElement;
		formData.telefono = formatTelefono(input.value);
	}

	function handleCaratulaChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			caratulaFile = input.files[0];
		}
	}

	function handleVideoChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			videoFile = input.files[0];
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!caratulaFile) {
			errorMessage = 'Por favor selecciona una imagen de carátula';
			submitStatus = 'error';
			return;
		}

		if (!aceptaTerminos) {
			errorMessage = 'Debes aceptar los términos y condiciones para continuar';
			submitStatus = 'error';
			return;
		}

		isSubmitting = true;
		errorMessage = '';

		try {
			const result = await crearRegistro(formData, caratulaFile, videoFile);

			if (result.success) {
				submitStatus = 'success';
				// Reset form
				formData = {
					email: '',
					nombreCompleto: '',
					nombreColectivo: '',
					telefono: '',
					sitioWeb: '',
					nacionalidad: '',
					pais: '',
					ciudad: '',
					rol: '',
					biografia: '',
					titulo: '',
					categoria: '',
					tema: '',
					duracion: '',
					anoProduccion: '',
					idiomaPrincipal: '',
					formatoVideo: '',
					tieneSubtitulos: '',
					sinopsis: ''
				};
				caratulaFile = null;
				videoFile = null;
				aceptaTerminos = false;
			} else {
				errorMessage = result.error || 'Error al procesar el registro';
				submitStatus = 'error';
			}
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Error desconocido';
			submitStatus = 'error';
		} finally {
			isSubmitting = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	const inputClass = "w-full px-4 py-2.5 border border-kuira-dark/20 rounded-xl focus:outline-none focus:border-kuira-naranja focus:ring-2 focus:ring-kuira-naranja/20 transition-all text-sm";
	const labelClass = "block text-sm font-medium text-kuira-dark/70 mb-1.5";
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-8"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- Modal Container -->
		<div class="relative w-full max-w-4xl my-8 animate-fadeInUp">
			<!-- Close Button -->
			<button
				onclick={closeModal}
				class="absolute -top-2 -right-2 md:top-4 md:right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-kuira-dark/60 hover:text-kuira-dark hover:bg-kuira-cream transition-colors"
				aria-label="Cerrar"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			{#if submitStatus === 'success'}
				<!-- Success Message -->
				<div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
					<div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h3 class="font-gotham text-2xl md:text-3xl font-bold text-green-800 mb-3">¡Registro exitoso!</h3>
					<p class="text-green-700 mb-8 max-w-md mx-auto">
						Tu obra ha sido registrada correctamente. Recibirás un correo de confirmación con los siguientes pasos.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onclick={() => submitStatus = 'idle'}
							class="btn-primary bg-green-600 hover:bg-green-700"
						>
							Registrar otra obra
						</button>
						<button
							onclick={closeModal}
							class="btn-secondary border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
						>
							Cerrar
						</button>
					</div>
				</div>
			{:else}
				<!-- Registration Form -->
				<div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="bg-kuira-naranja px-8 py-6 text-center">
						<h2 id="modal-title" class="font-gotham text-2xl md:text-3xl font-bold text-white">
							Inscribe tu obra
						</h2>
						<p class="text-white/80 mt-2">
							Convocatoria KUIRA 2026
						</p>
					</div>

					<!-- Form -->
					<form onsubmit={handleSubmit} class="p-6 md:p-10">
						<!-- Sección 1: Información Personal -->
						<div class="mb-10">
							<h3 class="font-gotham text-lg font-bold text-kuira-azul mb-5 flex items-center gap-3">
								<span class="w-7 h-7 bg-kuira-naranja text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
								Información Personal
							</h3>
							<div class="grid md:grid-cols-2 gap-5">
								<div>
									<label for="email" class={labelClass}>
										Correo electrónico *
									</label>
									<input
										type="email"
										id="email"
										bind:value={formData.email}
										required
										class={inputClass}
										placeholder="tu@email.com"
									/>
								</div>
								<div>
									<label for="nombreCompleto" class={labelClass}>
										Nombre completo *
									</label>
									<input
										type="text"
										id="nombreCompleto"
										bind:value={formData.nombreCompleto}
										required
										class={inputClass}
										placeholder="Tu nombre completo"
									/>
								</div>
								<div>
									<label for="nombreColectivo" class={labelClass}>
										Nombre del colectivo
									</label>
									<input
										type="text"
										id="nombreColectivo"
										bind:value={formData.nombreColectivo}
										class={inputClass}
										placeholder="Nombre de tu colectivo (si aplica)"
									/>
								</div>
								<div>
									<label for="telefono" class={labelClass}>
										Número de teléfono *
									</label>
									<input
										type="tel"
										id="telefono"
										value={formData.telefono}
										oninput={handleTelefonoInput}
										required
										class={inputClass}
										placeholder="656 123 4567"
									/>
									<p class="text-xs text-kuira-dark/50 mt-1">Formato: XXX XXX XXXX</p>
								</div>
								<div>
									<label for="sitioWeb" class={labelClass}>
										Sitio web o red social
									</label>
									<input
										type="url"
										id="sitioWeb"
										bind:value={formData.sitioWeb}
										class={inputClass}
										placeholder="https://instagram.com/tu-usuario"
									/>
								</div>
								<div>
									<label for="nacionalidad" class={labelClass}>
										Nacionalidad *
									</label>
									<input
										type="text"
										id="nacionalidad"
										bind:value={formData.nacionalidad}
										required
										class={inputClass}
										placeholder="Ej: Mexicana"
									/>
								</div>
							</div>
						</div>

						<!-- Sección 2: Ubicación -->
						<div class="mb-10">
							<h3 class="font-gotham text-lg font-bold text-kuira-azul mb-5 flex items-center gap-3">
								<span class="w-7 h-7 bg-kuira-naranja text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
								Ubicación
							</h3>
							<div class="grid md:grid-cols-2 gap-5">
								<div>
									<label for="pais" class={labelClass}>
										País *
									</label>
									<input
										type="text"
										id="pais"
										bind:value={formData.pais}
										required
										class={inputClass}
										placeholder="Ej: México"
									/>
								</div>
								<div>
									<label for="ciudad" class={labelClass}>
										Ciudad *
									</label>
									<input
										type="text"
										id="ciudad"
										bind:value={formData.ciudad}
										required
										class={inputClass}
										placeholder="Ej: Ciudad Juárez"
									/>
								</div>
							</div>
						</div>

						<!-- Sección 3: Profesional -->
						<div class="mb-10">
							<h3 class="font-gotham text-lg font-bold text-kuira-azul mb-5 flex items-center gap-3">
								<span class="w-7 h-7 bg-kuira-naranja text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
								Información Profesional
							</h3>
							<div class="grid gap-5">
								<div>
									<label for="rol" class={labelClass}>
										Rol en el proyecto *
									</label>
									<select
										id="rol"
										bind:value={formData.rol}
										required
										class="{inputClass} bg-white"
									>
										<option value="">Selecciona tu rol</option>
										<option value="director">Director/a</option>
										<option value="productor">Productor/a</option>
										<option value="actor">Actor/Actriz</option>
										<option value="guionista">Guionista</option>
										<option value="editor">Editor/a</option>
										<option value="fotografo">Director/a de fotografía</option>
										<option value="sonido">Diseñador/a de sonido</option>
										<option value="disenador">Diseñador/a</option>
										<option value="compositor">Compositor/a musical</option>
										<option value="otro">Otro</option>
									</select>
								</div>
								<div>
									<label for="biografia" class={labelClass}>
										Biografía (trayectoria y experiencia) *
									</label>
									<textarea
										id="biografia"
										bind:value={formData.biografia}
										required
										rows="4"
										class="{inputClass} resize-none"
										placeholder="Describe brevemente tu trayectoria profesional y experiencia en el cine"
										maxlength="1000"
									></textarea>
									<p class="text-xs text-kuira-dark/50 mt-1">{formData.biografia.length}/1000 caracteres</p>
								</div>
							</div>
						</div>

						<!-- Sección 4: Datos de la Obra -->
						<div class="mb-10">
							<h3 class="font-gotham text-lg font-bold text-kuira-azul mb-5 flex items-center gap-3">
								<span class="w-7 h-7 bg-kuira-naranja text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
								Datos de la Obra
							</h3>
							<div class="grid md:grid-cols-2 gap-5">
								<div class="md:col-span-2">
									<label for="titulo" class={labelClass}>
										Título de la película *
									</label>
									<input
										type="text"
										id="titulo"
										bind:value={formData.titulo}
										required
										class={inputClass}
										placeholder="Título de tu película o cortometraje"
									/>
								</div>
								<div>
									<label for="categoria" class={labelClass}>
										Categoría *
									</label>
									<select
										id="categoria"
										bind:value={formData.categoria}
										required
										class="{inputClass} bg-white"
									>
										<option value="">Selecciona una categoría</option>
										<option value="cortometraje">Cortometraje (hasta 30 min)</option>
										<option value="largometraje">Largometraje (60+ min)</option>
										<option value="documental">Documental</option>
										<option value="animacion">Animación</option>
										<option value="experimental">Experimental</option>
									</select>
								</div>
								<div>
									<label for="tema" class={labelClass}>
										Tema / Eje temático *
									</label>
									<select
										id="tema"
										bind:value={formData.tema}
										required
										class="{inputClass} bg-white"
									>
										<option value="">Selecciona un eje temático</option>
										<option value="korima">Kórima - Solidaridad y resistencia colectiva</option>
										<option value="sipaachi">Sipáachi - Migración, identidad y pertenencia</option>
										<option value="cherame">Chérame - Resiliencia urbana y justicia social</option>
									</select>
								</div>
								<div>
									<label for="duracion" class={labelClass}>
										Duración (minutos) *
									</label>
									<input
										type="number"
										id="duracion"
										bind:value={formData.duracion}
										required
										min="1"
										max="180"
										class={inputClass}
										placeholder="Ej: 25"
									/>
								</div>
								<div>
									<label for="anoProduccion" class={labelClass}>
										Año de producción *
									</label>
									<input
										type="number"
										id="anoProduccion"
										bind:value={formData.anoProduccion}
										required
										min="2020"
										max="2026"
										class={inputClass}
										placeholder="Ej: 2025"
									/>
								</div>
								<div>
									<label for="idiomaPrincipal" class={labelClass}>
										Idioma principal *
									</label>
									<input
										type="text"
										id="idiomaPrincipal"
										bind:value={formData.idiomaPrincipal}
										required
										class={inputClass}
										placeholder="Ej: Español"
									/>
								</div>
								<div>
									<label for="formatoVideo" class={labelClass}>
										Formato de video *
									</label>
									<select
										id="formatoVideo"
										bind:value={formData.formatoVideo}
										required
										class="{inputClass} bg-white"
									>
										<option value="">Selecciona el formato</option>
										<option value="mp4">MP4</option>
										<option value="mov">MOV</option>
										<option value="mkv">MKV</option>
										<option value="avi">AVI</option>
										<option value="prores">ProRes</option>
										<option value="otro">Otro</option>
									</select>
								</div>
								<div>
									<label for="tieneSubtitulos" class={labelClass}>
										¿La película tiene subtítulos? *
									</label>
									<select
										id="tieneSubtitulos"
										bind:value={formData.tieneSubtitulos}
										required
										class="{inputClass} bg-white"
									>
										<option value="">Selecciona una opción</option>
										<option value="si-espanol">Sí, en español</option>
										<option value="si-ingles">Sí, en inglés</option>
										<option value="si-ambos">Sí, en español e inglés</option>
										<option value="no">No tiene subtítulos</option>
									</select>
								</div>
								<div class="md:col-span-2">
									<label for="sinopsis" class={labelClass}>
										Sinopsis *
									</label>
									<textarea
										id="sinopsis"
										bind:value={formData.sinopsis}
										required
										rows="4"
										class="{inputClass} resize-none"
										placeholder="Describe brevemente la trama de tu película"
										maxlength="800"
									></textarea>
									<p class="text-xs text-kuira-dark/50 mt-1">{formData.sinopsis.length}/800 caracteres</p>
								</div>

								<!-- Imagen de carátula -->
								<div class="md:col-span-2">
									<label for="caratula" class={labelClass}>
										Imagen de carátula de la película *
									</label>
									<div class="border-2 border-dashed rounded-xl p-6 text-center transition-colors {caratulaFile ? 'border-kuira-naranja bg-kuira-naranja/5' : 'border-kuira-dark/20 hover:border-kuira-naranja'}">
										<input
											type="file"
											id="caratula"
											accept="image/*"
											onchange={handleCaratulaChange}
											class="hidden"
										/>
										<label for="caratula" class="cursor-pointer">
											{#if caratulaFile}
												<div class="flex items-center justify-center gap-3 text-kuira-naranja">
													<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
													</svg>
													<span class="font-medium">{caratulaFile.name}</span>
												</div>
											{:else}
												<svg class="w-10 h-10 mx-auto text-kuira-dark/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
												<p class="text-kuira-dark/60 text-sm">Haz clic para subir la imagen de carátula</p>
												<p class="text-kuira-dark/40 text-xs mt-1">JPG, PNG o WEBP (máx. 5MB)</p>
											{/if}
										</label>
									</div>
								</div>

								<!-- Archivo de video -->
								<div class="md:col-span-2">
									<label for="videoFile" class={labelClass}>
										Archivo de video (opcional)
									</label>
									<div class="border-2 border-dashed border-kuira-dark/20 rounded-xl p-6 text-center hover:border-kuira-naranja transition-colors">
										<input
											type="file"
											id="videoFile"
											accept="video/*"
											onchange={handleVideoChange}
											class="hidden"
										/>
										<label for="videoFile" class="cursor-pointer">
											{#if videoFile}
												<div class="flex items-center justify-center gap-3 text-kuira-naranja">
													<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
													</svg>
													<span class="font-medium">{videoFile.name}</span>
												</div>
											{:else}
												<svg class="w-10 h-10 mx-auto text-kuira-dark/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
												<p class="text-kuira-dark/60 text-sm">Haz clic para subir el archivo de video</p>
												<p class="text-kuira-dark/40 text-xs mt-1">MP4, MOV, MKV (si no tienes link de video)</p>
											{/if}
										</label>
									</div>
								</div>
							</div>
						</div>

						<!-- Terms -->
						<div class="mb-6">
							<label class="flex items-start gap-3 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={aceptaTerminos}
									class="mt-0.5 w-4 h-4 rounded border-kuira-dark/20 text-kuira-naranja focus:ring-kuira-naranja"
								/>
								<span class="text-sm text-kuira-dark/70">
									Acepto los <a href="/terminos-condiciones.pdf" target="_blank" class="text-kuira-naranja hover:underline">términos y condiciones</a>
									y el <a href="/aviso-privacidad.pdf" target="_blank" class="text-kuira-naranja hover:underline">aviso de privacidad</a>.
								</span>
							</label>
						</div>

						<!-- Submit Button -->
						<div class="flex flex-col sm:flex-row gap-3">
							<button
								type="submit"
								disabled={isSubmitting}
								class="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isSubmitting}
									<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Enviando...
								{:else}
									Enviar registro
								{/if}
							</button>
							<button
								type="button"
								onclick={closeModal}
								class="btn-secondary py-3"
							>
								Cancelar
							</button>
						</div>

						{#if submitStatus === 'error'}
							<p class="text-center text-red-600 mt-4 text-sm">
								{errorMessage || 'Hubo un error al enviar tu registro. Por favor intenta de nuevo.'}
							</p>
						{/if}
					</form>
				</div>
			{/if}
		</div>
	</div>
{/if}
