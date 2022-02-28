<script lang="ts" context="module">
	export const load: ErrorLoad = ({ error, status }) => {
		return {
			props: {
				error,
				status,
			},
		};
	};
</script>

<script lang="ts">
	import type { ErrorLoad } from '@sveltejs/kit';
	import { dev } from '$app/env';
	import Head from '$lib/core/components/Head.svelte';
	import ErrorPage from '$lib/core/components/error/ErrorPage.svelte';

	export let error: Maybe<Error>;
	export let status: number;
</script>

<Head subtitle="something went wrong" />

{#if dev}
	<div>
		<h1 class="text-title-3">Status</h1>
		<p>
			{status}
		</p>
		<h1 class="text-title-3">Stack trace</h1>
		<pre class="font-normal">
			{error?.stack}
		</pre>
	</div>
{:else}
	<ErrorPage {status} />
{/if}
