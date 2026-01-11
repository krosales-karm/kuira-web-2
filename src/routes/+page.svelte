<script lang="ts">
	import { Navbar, Hero, About, Ejes, Convocatoria, Categorias, RegistroModal, Contacto, Footer } from '$lib';

	let isRegistroOpen = $state(false);

	function openRegistro() {
		isRegistroOpen = true;
	}
</script>

<Navbar {openRegistro} />

<main>
	<Hero {openRegistro} />
	<About />
	<Ejes />
	<Convocatoria {openRegistro} />
	<Categorias />
	<Contacto />
</main>

<Footer {openRegistro} />

<RegistroModal bind:isOpen={isRegistroOpen} />
