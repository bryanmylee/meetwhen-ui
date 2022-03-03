<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { browser } from '$app/env';
	import { FirstVisibleChild } from '$lib/core/components/visibleChild';
	import { createPopperActions } from 'svelte-popperjs';
	import { touchEnabled } from '$lib/core/state';

	export let disabled = true;
	export let touched = false;

	export let scrollElement: Maybe<HTMLDivElement>;
	const [hintRef, hintContent] = createPopperActions({
		placement: 'right',
		strategy: 'fixed',
		modifiers: [
			{ name: 'arrow', options: { padding: 6 } },
			{ name: 'eventListeners', options: { resize: false } },
			{ name: 'offset', options: { offset: [0, 6] } },
			{
				name: 'preventOverflow',
				options: {
					altAxis: true,
					padding: 8,
				},
			},
		],
	});
	let showHint = false;
	let showHintTimeout: Maybe<number>;
	$: if (touched) {
		showHint = false;
		if (browser) {
			window.clearTimeout(showHintTimeout);
		}
	}
	$: if (!disabled) {
		if (browser) {
			showHintTimeout = window.setTimeout(() => {
				showHint = true;
			}, 2000);
		}
	} else {
		showHint = false;
		if (browser) {
			window.clearTimeout(showHintTimeout);
		}
	}
</script>

<FirstVisibleChild
	selector="[data-select-id]"
	root={scrollElement}
	rootMargin="-25%"
	use={[hintRef]}
/>
{#if showHint}
	<div
		class="hint"
		use:hintContent
		transition:fade={{ easing: cubicOut, duration: 300 }}
	>
		<div data-popper-arrow>
			<div class="hint-arrow" />
		</div>
		{$touchEnabled ? 'Long touch and drag' : 'Click and drag'}
	</div>
{/if}

<style lang="postcss">
	.hint {
		@apply fixed p-2 rounded-lg z-50 pointer-events-none;
		@apply text-white text-label bg-primary-400/50;
		@apply backdrop-blur-sm;
	}

	.hint-arrow {
		@apply wh-0 border-4 border-transparent;
	}

	.hint:global([data-popper-placement^='right']) {
		& [data-popper-arrow] {
			@apply left-0;
		}
		& .hint-arrow {
			@apply border-r-primary-400/50;
			transform: translate(calc(-100% - 0.2px));
		}
	}

	.hint:global([data-popper-placement^='left']) {
		& [data-popper-arrow] {
			@apply right-0;
		}
		& .hint-arrow {
			@apply border-l-primary-400/50;
			transform: translate(calc(100% + 0.2px));
		}
	}
</style>
