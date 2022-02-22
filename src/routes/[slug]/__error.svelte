<script lang="ts" context="module">
	export const load: ErrorLoad = ({ error, status, params }) => {
		const { slug } = params;
		return {
			props: {
				error,
				status,
				slug,
			},
		};
	};
</script>

<script lang="ts">
	import type { ErrorLoad } from '@sveltejs/kit';
	import { dev } from '$app/env';
	import Head from '$lib/core/components/Head.svelte';
	import ErrorPage from '$lib/core/components/error/ErrorPage.svelte';
	import MeetingNotFound from '$lib/core/components/error/MeetingNotFound.svelte';

	export let error: Maybe<Error>;
	export let status: number;
	export let slug: string;
</script>

<Head subtitle="meeting not found" />

{#if !dev}
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
{:else if status === 404}
	<MeetingNotFound {slug} />
{:else}
	<ErrorPage {status} />
{/if}
