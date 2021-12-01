<script lang="ts">
	import { fade } from 'svelte/transition';

	import { createPopperActions } from 'svelte-popperjs';

	const [ref, content] = createPopperActions({
		placement: 'right',
		modifiers: [
			{ name: 'offset', options: { offset: [0, 8] } },
			{
				name: 'preventOverflow',
				options: {
					altAxis: true,
					padding: {
						left: 12,
						right: 12,
					},
				},
			},
		],
	});

	// whether the hint should be shown.
	export let show = false;
	export let delay = 0;
	export let referenceElement: HTMLElement = undefined;

	$: if (referenceElement !== undefined) {
		ref(referenceElement);
	}

	let showHint = false;
	let timer: NodeJS.Timeout;

	$: if (show) {
		timer = setTimeout(() => {
			showHint = true;
		}, delay);
	}

	$: if (!show) {
		disableHint();
	}

	const disableHint = () => {
		showHint = false;
		clearTimeout(timer);
		timer = undefined;
	};
</script>

{#if showHint}
	<div
		use:content
		transition:fade={{ duration: 150 }}
		class="z-50 p-2 text-sm text-primary-text rounded-md hint bg-primary shadow-md-primary"
	>
		<div data-popper-arrow>
			<div class="w-3 h-3 transform rotate-45 hint--arrow bg-primary" />
		</div>
		<slot />
	</div>
{/if}

<style lang="postcss">
	:global(.hint[data-popper-placement^='right']) {
		& [data-popper-arrow] {
			@apply left-0;
		}
		& .hint--arrow {
			--tw-translate-x: -50%;
		}
	}

	:global(.hint[data-popper-placement^='left']) {
		& [data-popper-arrow] {
			@apply right-0;
		}
		& .hint--arrow {
			--tw-translate-x: 50%;
		}
	}
</style>
