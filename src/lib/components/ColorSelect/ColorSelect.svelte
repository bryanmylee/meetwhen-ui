<script lang="ts">
	import { clickOutside } from '$lib/utils/actions/use-click-outside';
	import ColorPicker from './ColorPicker.svelte';

	export let value;

	let showPicker = false;

	let className = '';
	export { className as class };
</script>

<div class="relative">
	<button
		type="button"
		tabindex="0"
		on:click={() => (showPicker = !showPicker)}
		class="{className} p-3 shade focusable rounded-xl cursor-pointer"
	>
		<div class="w-6 h-6 rounded-full bg-primary focusable" />
	</button>
	{#if showPicker}
		<div
			use:clickOutside={() => setTimeout(() => (showPicker = false), 17)}
			class="absolute right-0 bottom-full"
		>
			<ColorPicker bind:value />
		</div>
	{/if}
</div>
