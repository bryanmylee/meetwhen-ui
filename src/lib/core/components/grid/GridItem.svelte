<script lang="ts">
	import { cssVars } from '$lib/core/utils/cssVars';

	export let x = 0;
	export let y = 0;
	export let width = 1;
	export let height = 1;
	$: vars = {
		rowStart: y + 1,
		rowEnd: y + 1 + height,
		colStart: x + 1,
		colEnd: x + 1 + width,
	};

	let elementRef: HTMLDivElement;
</script>

<div bind:this={elementRef} {...$$props} style={cssVars(vars)}>
	<slot {elementRef} />
</div>

<style>
	div {
		grid-area: var(--rowStart) / var(--colStart) / var(--rowEnd) / var(--colEnd);
	}
</style>
