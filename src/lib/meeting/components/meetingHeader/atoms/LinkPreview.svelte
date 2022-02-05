<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createPopperActions } from 'svelte-popperjs';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { hover } from '$lib/core/utils/useHover';
	import { Button } from '$lib/input';

	const [ref, content] = createPopperActions({
		placement: 'bottom-start',
		strategy: 'absolute',
		modifiers: [{ name: 'flip' }],
	});

	export let link: string;
	let url: Maybe<URL>;
	$: try {
		url = new URL(link);
	} catch {
		url = undefined;
	}

	const isHovering = writable(false);
</script>

<Button
	href={link}
	size="sm"
	color="gray"
	use={[ref, [hover, isHovering]]}
	class="link-preview group"
>
	{url?.host}
	{#if $isHovering}
		<div class="link-preview-popover-box" use:content>
			<div
				class="link-preview-popover"
				in:fade={{ duration: 300, easing: cubicOut }}
				out:fade={{ duration: 300, delay: 300, easing: cubicOut }}
			>
				{link}
			</div>
		</div>
	{/if}
</Button>

<style lang="postcss">
	:global(.link-preview) {
		@apply relative;
	}

	.link-preview-popover-box {
		@apply absolute w-fit max-w-80 py-2;
	}

	.link-preview-popover {
		@apply text-label-sm whitespace-nowrap text-ellipsis overflow-hidden;
		@apply p-2 bg-shade-50 rounded-xl shadow-wide;
	}
</style>
