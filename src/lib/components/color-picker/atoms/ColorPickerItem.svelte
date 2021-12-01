<script lang="ts" context="module">
	export interface ColorItemEvent {
		click: {
			hex: string;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getColorSet } from '$lib/utils/stores/colors-store';
	import { cssVars } from '$lib/utils/css-vars';
	import { isDark } from '$lib/app-state';

	const dispatch = createEventDispatcher<ColorItemEvent>();

	export let hex: string;
	$: colorSet = getColorSet(hex, $isDark);
	$: colorVars = {
		primary: colorSet.DEFAULT,
		'primary-lighter': colorSet.lighter,
	};
</script>

<button
	type="button"
	aria-label="Pick color {hex}"
	on:click={() => dispatch('click', { hex })}
	class="w-6 h-6 rounded-full bg-primary focusable"
	style={cssVars(colorVars)}
/>
