<script lang="ts" context="module">
	export const load: Load = async ({ url }) => {
		const backRoute = url.searchParams.get('back') ?? '/';
		return {
			props: {
				backRoute,
			},
		};
	};
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { AuthCard } from '$lib/auth/components/authDialog';
	import Head from '$lib/core/components/Head.svelte';

	export let backRoute: string;
	let isCreating = false;
</script>

<Head subtitle="login" />

<section>
	<div class="w-full max-w-xl md:max-w-3xl p-4 mx-auto">
		<AuthCard bind:isCreating />
	</div>
</section>
