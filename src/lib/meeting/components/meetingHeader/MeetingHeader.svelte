<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ChevronDownIcon, ShareIcon } from 'svelte-feather-icons';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { Button } from '$lib/input';
	import { ShareDialog } from '$lib/meeting/components';
	import type { LinkPreviewData } from '$lib/core/types/LinkPreviewData';
	import LinkPreview from './atoms/LinkPreview.svelte';
	import { classes } from '$lib/core/utils/classes';

	export let name: string;
	export let slug: string;
	export let description: Maybe<string> = undefined;
	export let links: Maybe<LinkPreviewData[]> = undefined;

	$: hasMoreDetails = description !== undefined || links !== undefined;
	export let showMoreDetails = true;
	let showShareDialog = false;
</script>

<header class="meeting-header-box">
	<span />
	<div class="meeting-header">
		<h1 class="text-subtitle">{name}</h1>
		{#if showMoreDetails}
			<div transition:slide|local={{ duration: 300, easing: cubicOut }}>
				{#if description !== undefined}
					<p>
						{description}
					</p>
				{/if}
				{#if links !== undefined && links.length > 0}
					<div class="flex flex-wrap gap-2 mt-3">
						{#each links as { url, title, description, favicons }}
							<LinkPreview
								link={url}
								{title}
								{description}
								favicon={favicons?.[0]}
							/>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
	<div class="flex gap-2">
		<Button icon variant="text-only" on:click={() => (showShareDialog = true)}>
			<ShareIcon class="wh-5" />
		</Button>
		{#if hasMoreDetails}
			<Button
				icon
				variant="text-only"
				aria-expanded={showMoreDetails}
				on:click={() => (showMoreDetails = !showMoreDetails)}
			>
				<ChevronDownIcon
					class={classes(
						'wh-5 transition-transform',
						showMoreDetails && 'rotate-180',
					)}
				/>
			</Button>
		{/if}
	</div>
</header>
<ShareDialog bind:open={showShareDialog} {slug} />

<style lang="postcss">
	.meeting-header-box {
		@apply relative p-4 card;
		@apply flex justify-between items-start gap-2;

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
