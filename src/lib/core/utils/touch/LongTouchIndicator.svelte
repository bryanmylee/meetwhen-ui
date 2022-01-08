<script lang="ts">
	import { onMount } from 'svelte';
	import { cssVars } from '$lib/core/utils/cssVars';
	import { classes } from '$lib/core/utils/classes';

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

	$: vars = {
		x: x + 'px',
		y: y + 'px',
		triggerDelay: triggerDelay + 'ms',
		triggerDuration: triggerDuration + 'ms',
		outroDuration: outroDuration + 'ms',
	};
</script>

<div
	id="indicator"
	class={classes(
		'fixed wh-28 rounded-full pointer-events-none bg-white/50',
		triggered && 'border-4 border-white shadow-lg opacity-0',
	)}
	class:expanding
	style={cssVars(vars)}
/>

<style lang="postcss">
	div {
		transform: translate(-50%, -50%) scale(0.25);
		left: var(--x);
		top: var(--y);
		transition: transform var(--triggerDelay) ease-out,
			opacity var(--outroDuration) ease-out var(--triggerDuration);
	}

	div.expanding {
		transform: translate(-50%, -50%) scale(1);
	}
</style>
