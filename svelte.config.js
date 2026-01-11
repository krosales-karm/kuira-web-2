import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		prerender: {
			handleHttpError: ({ path }) => {
				// Ignore missing files that will be added later
				if (path === '/bases.pdf' || path === '/privacidad' || path === '/terminos') {
					return;
				}
			}
		}
	}
};

export default config;
