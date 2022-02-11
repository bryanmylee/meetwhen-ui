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
		@apply fixed wh-40 rounded-full bg-primary-400/30;
		@apply pointer-events-none z-[9999];
		@apply blur-md backdrop-blur-sm;
		transform: translate(-50%, -50%) scale(0.25);
		left: var(--x);
		top: var(--y);
		transition: transform var(--triggerDelay) ease-out,
			opacity var(--outroDuration) ease-out var(--triggerDuration);

		&.triggered {
			@apply border-4 border-primary-600 gdark:border-white;
			@apply bg-primary-400/50;
			@apply shadow-lg opacity-0;
			@apply blur-none;
		}

		&.expanding {
			transform: translate(-50%, -50%) scale(1);
		}
	}
</style>
