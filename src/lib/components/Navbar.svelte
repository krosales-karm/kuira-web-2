<script lang="ts">
	let { openRegistro }: { openRegistro: () => void } = $props();

	let isMenuOpen = $state(false);
	let isScrolled = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	$effect(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const navLinks = [
		{ href: '#nosotros', label: 'Nosotros' },
		{ href: '#ejes', label: 'Ejes Temáticos' },
		{ href: '#convocatoria', label: 'Convocatoria' },
		{ href: '#categorias', label: 'Categorías' },
		{ href: '#contacto', label: 'Contacto' }
	];
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
	class:bg-white={isScrolled}
	class:shadow-lg={isScrolled}
	class:bg-transparent={!isScrolled}
>
	<div class="container-kuira">
		<div class="flex items-center justify-between h-20">
			<!-- Logo -->
			<a href="/" class="flex items-center">
				<img
					src="/images/logos/logo.png"
					alt="KUIRA"
					class="h-12 w-auto transition-all duration-300"
					class:brightness-0={!isScrolled}
					class:invert={!isScrolled}
				/>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="font-gotham text-sm font-semibold uppercase tracking-wide transition-colors duration-200"
						class:text-white={!isScrolled}
						class:hover:text-kuira-oro={!isScrolled}
						class:text-kuira-azul={isScrolled}
						class:hover:text-kuira-terracota={isScrolled}
					>
						{link.label}
					</a>
				{/each}
				<button
					onclick={openRegistro}
					class="btn-primary text-sm cursor-pointer"
				>
					Participa
				</button>
			</div>

			<!-- Mobile Menu Button -->
			<button
				onclick={toggleMenu}
				class="md:hidden p-2 rounded-lg transition-colors"
				class:text-white={!isScrolled}
				class:text-kuira-azul={isScrolled}
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if isMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>

		<!-- Mobile Navigation -->
		{#if isMenuOpen}
			<div class="md:hidden bg-white rounded-2xl shadow-xl mb-4 overflow-hidden">
				<div class="p-4 space-y-2">
					{#each navLinks as link}
						<a
							href={link.href}
							onclick={closeMenu}
							class="block py-3 px-4 font-gotham text-sm font-semibold uppercase tracking-wide text-kuira-azul hover:bg-kuira-cream rounded-lg transition-colors"
						>
							{link.label}
						</a>
					{/each}
					<button
						onclick={() => { closeMenu(); openRegistro(); }}
						class="block w-full btn-primary text-center mt-4 cursor-pointer"
					>
						Participa
					</button>
				</div>
			</div>
		{/if}
	</div>
</nav>
