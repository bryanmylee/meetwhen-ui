<script lang="ts">
	import { onMount } from 'svelte';

	export let x = 0;
	export let y = 0;
	export let triggerDelay = 100;

	// time to wait after trigger before unmounting element.
	export const triggerDuration = 300;
	export const outroDuration = 300;

	let expanding = false;
	let triggered = false;

	onMount(() => {
		requestAnimationFrame(() => {
			expanding = true;
		});
		setTimeout(() => {
			triggered = true;
		}, triggerDelay);
	});
</script>

<div
	id="indicator"
	class:triggered
	class:expanding
	style:--x="{x}px"
	style:--y="{y}px"
	style:--triggerDelay="{triggerDelay}ms"
	style:--triggerDuration="{triggerDuration}ms"
	style:--outroDuration="{outroDuration}ms"
/>

<style lang="postcss">
	div {
		@apply fixed wh-40 rounded-full bg-primary-400/50;
		@apply pointer-events-none z-[9999];
		@apply backdrop-blur-sm;
		transform: translate(-50%, -50%) scale(0.25);
		left: var(--x);
		top: var(--y);
		transition: transform var(--triggerDelay)
				cubic-bezier(0.94, 0.29, 0.72, 0.91),
			opacity var(--outroDuration) ease-out var(--triggerDuration);

		&.triggered {
			@apply border-4 border-primary-600 gdark:border-white shadow-lg opacity-0;
		}

		&.expanding {
			transform: translate(-50%, -50%) scale(1);
		}
	}
</style>
