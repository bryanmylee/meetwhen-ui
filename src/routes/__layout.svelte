<script lang="ts" context="module">
	export const load: Load = ({ fetch, page, session }) => {
		queryClient.fetch = fetch;
		queryClient.endpoint = '/api/graphql';
		activeMeeting.set(null);
		console.log(session);
		darkModeSetting.set('dark');
		console.log(get(isDark));
		return {
			props: {
				key: page.path,
			},
		};
	};
</script>

<script lang="ts">
	import '../app.postcss';
	import Nav from '$lib/components/navbar/organisms/Nav.svelte';
	import PageTransition from '$lib/components/utils/PageTransition.svelte';
	import type { Load } from '@sveltejs/kit';
	import {
		APP_ID,
		activeMeeting,
		darkModeSetting,
		isDark,
		primaryColorCssVars,
	} from '$lib/app-state';
	import { classes } from '$lib/utils/classes';
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import { queryClient } from '$lib/gql';
	import { useScreenHeight } from '$lib/utils/screen-height';
	import { get } from 'svelte/store';

	export let key: string;
	onMount(() => {
		useScreenHeight();
	});
</script>

<div
	id={APP_ID}
	class={classes(['fixed inset-0', $isDark ? 'dark bg-gray-900' : 'bg-white'])}
	style={$primaryColorCssVars}
>
	<Nav {key} />
	<main class="mt-14">
		<PageTransition {key} isLoading={$navigating !== null}>
			<slot />
		</PageTransition>
	</main>
</div>
