<script lang="ts">
	import { onMount } from 'svelte';

	export let x = 0;
	export let y = 0;
	export let triggerDelay = 100;

	// time to wait after trigger before unmounting element.
	export const triggerDuration = 200;
	export const outroDuration = 400;

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
		@apply fixed wh-28 rounded-full pointer-events-none bg-primary-400/50 z-[9999];
		transform: translate(-50%, -50%) scale(0.25);
		left: var(--x);
		top: var(--y);
		transition: transform var(--triggerDelay) ease-out,
			opacity var(--outroDuration) ease-out var(--triggerDuration);

		&.triggered {
			@apply border-4 border-primary-400 shadow-lg opacity-0;
		}

		&.expanding {
			transform: translate(-50%, -50%) scale(1);
		}
	}
</style>
