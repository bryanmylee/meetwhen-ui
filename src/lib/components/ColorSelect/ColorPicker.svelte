<script lang="ts">
	import { cssVars } from '$lib/utils/css-vars';
	import type { ColorItemEvent } from './ColorPickerItem.svelte';
	import ColorPickerRow from './ColorPickerRow.svelte';

	export let value: string;

	const hues = [0, 32, 50, 110, 160, 200, 220, 260, 300, 330];

	const handleClick = ({ detail }: CustomEvent<ColorItemEvent['click']>) => {
		value = detail.hex;
	};
</script>

<div class="p-3 card" style={cssVars({ numCols: hues.length })}>
	<div class="p-3 rounded-lg picker-grid shade">
		<ColorPickerRow {hues} light={0.52} sat={1} on:click={handleClick} />
		<ColorPickerRow {hues} light={0.75} sat={1} on:click={handleClick} />
		<ColorPickerRow {hues} light={0.75} sat={0.2} on:click={handleClick} />
		<ColorPickerRow {hues} light={0.52} sat={0.2} on:click={handleClick} />
	</div>
</div>

<style lang="postcss">
	.picker-grid {
		@apply grid gap-2;
		grid-template-columns: repeat(var(--numCols), 1fr);
	}
</style>
