<script lang="ts">
	import { ShareIcon } from 'svelte-feather-icons';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { Button } from '$lib/input';
	import { ShareDialog } from '$lib/meeting/components';

	export let name: string;
	export let slug: string;
	export let description: Maybe<string> = undefined;
	export let links: string[] = [];

	let showShareDialog = false;
</script>

<header class="meeting-header-box">
	<span />
	<div class="meeting-header">
		<h1 class="text-headline">{name}</h1>
		{#if description !== undefined}
			<p>
				{description}
			</p>
		{/if}
	</div>
	<Button icon variant="text-only" on:click={() => (showShareDialog = true)}>
		<ShareIcon class="wh-4" />
	</Button>
</header>
<ShareDialog bind:open={showShareDialog} {slug} />

<style lang="postcss">
	.meeting-header-box {
		@apply relative p-4 card;
		@apply flex justify-between items-start;

		& > span {
			@apply block absolute left-0 top-0 bottom-0 w-3 rounded-l-xl;
			@apply overflow-hidden text-ellipsis;
			@apply bg-gradient-to-tr from-primary-400-2 via-primary-400 to-primary-400+1;
		}
	}

	.meeting-header {
		@apply block ml-3;
		@apply flex flex-col gap-2;
	}
</style>
