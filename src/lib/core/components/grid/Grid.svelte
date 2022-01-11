<script lang="ts">
	import { cssVars } from '$lib/core/utils/cssVars';

	export let rows = 1;
	export let cols = 1;
	$: vars = { rows, cols };

	let elementRef: HTMLDivElement;
</script>

<div bind:this={elementRef} {...$$props} style={cssVars(vars)}>
	<slot />
</div>

<style>
	div {
		display: grid;
		grid-template: repeat(var(--rows), auto) / repeat(var(--cols), auto);
	}
</style>
