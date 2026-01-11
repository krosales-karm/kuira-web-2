<script lang="ts">
	let { openRegistro }: { openRegistro: () => void } = $props();

	const currentYear = new Date().getFullYear();

	const footerLinks = [
		{
			title: 'Festival',
			links: [
				{ label: 'Nosotros', href: '#nosotros' },
				{ label: 'Ejes Temáticos', href: '#ejes' },
				{ label: 'Convocatoria', href: '#convocatoria' },
				{ label: 'Categorías', href: '#categorias' }
			]
		},
		{
			title: 'Participar',
			links: [
				{ label: 'Registro', href: '#registro', isButton: true },
				{ label: 'Contacto', href: '#contacto' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Aviso de Privacidad', href: '/aviso-privacidad.pdf' },
				{ label: 'Términos y Condiciones', href: '/terminos-condiciones.pdf' }
			]
		}
	];
</script>

<footer class="bg-kuira-dark text-white">
	<div class="container-kuira">
		<!-- Main Footer -->
		<div class="py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-10">
			<!-- Brand -->
			<div class="lg:col-span-2">
				<img src="/images/logos/logo-blanco.png" alt="KUIRA" class="h-16 mb-6" />
				<p class="text-white/60 mb-6 max-w-sm">
					Festival itinerante de cine independiente que visibiliza problemáticas sociales
					y fortalece la identidad cultural fronteriza.
				</p>
				<p class="text-kuira-oro font-gotham font-semibold">
					Ciudad Juárez, Chihuahua
				</p>
			</div>

			<!-- Links -->
			{#each footerLinks as section}
				<div>
					<h4 class="font-gotham font-bold text-white mb-4">{section.title}</h4>
					<ul class="space-y-3">
						{#each section.links as link}
							<li>
								{#if link.isButton}
									<button
										onclick={openRegistro}
										class="text-white/60 hover:text-kuira-oro transition-colors text-sm cursor-pointer"
									>
										{link.label}
									</button>
								{:else}
									<a
										href={link.href}
										class="text-white/60 hover:text-kuira-oro transition-colors text-sm"
									>
										{link.label}
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Bottom Bar -->
		<div class="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
			<p class="text-white/40 text-sm">
				© {currentYear} KUIRA Festival de Cine Fronterizo. Todos los derechos reservados.
			</p>
			<p class="text-white/40 text-sm">
				Primera edición: Abril 2026
			</p>
		</div>
	</div>
</footer>
