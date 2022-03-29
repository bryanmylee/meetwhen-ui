<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ChevronDownIcon, ShareIcon } from 'svelte-feather-icons';
	import { media } from '$lib/core/state';
	import { Button } from '$lib/input';
	import { ShareDialog } from '$lib/meeting/components';
	import type { LinkPreviewData } from '$lib/core/types';
	import LinkPreview from './atoms/LinkPreview.svelte';
	import { classes } from '$lib/core/utils';

	export let name: string;
	export let slug: string;
	export let description: Maybe<string> = undefined;
	export let links: Maybe<LinkPreviewData[]> = undefined;

	$: hasMoreDetails = description !== undefined || links !== undefined;
	let showMoreDetails = true;
	let showShareDialog = false;

	$: if ($media.lg) {
		showMoreDetails = true;
	}

	const toggleShowMoreDetails = () => {
		if ($media.lg) {
			return;
		}
		showMoreDetails = !showMoreDetails;
	};
</script>

<header class="meeting-header-box">
	<span />
	<div class="meeting-header">
		<div class="flex justify-between items-start gap-2 w-full">
			<div class="flex items-start gap-2">
				{#if hasMoreDetails && !$media.lg}
					<Button
						icon
						variant="text-only"
						aria-expanded={showMoreDetails}
						on:click={toggleShowMoreDetails}
						class="-ml-1"
					>
						<ChevronDownIcon
							class={classes(
								'wh-5 transition-transform',
								showMoreDetails && 'rotate-180',
							)}
						/>
					</Button>
				{/if}
				<h1 class="text-subtitle">{name}</h1>
			</div>
			<Button
				icon
				variant="text-only"
				on:click={() => (showShareDialog = true)}
			>
				<ShareIcon class="wh-5" />
			</Button>
		</div>
		{#if hasMoreDetails && showMoreDetails}
			<div
				transition:slide|local={{ duration: 300, easing: cubicOut }}
				class="mt-2"
			>
				{#if description !== undefined}
					<p class="text-sm">
						{description}
					</p>
				{/if}
				{#if links !== undefined && links.length > 0}
					<div class="flex flex-wrap gap-2 mt-3 only:mt-1">
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
	<ShareDialog bind:open={showShareDialog} {slug} />
</header>

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
		@apply w-full flex flex-col ml-3;
	}
</style>
