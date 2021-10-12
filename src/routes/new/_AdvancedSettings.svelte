<script lang="ts">
	import { emoji, color } from './_state/meeting';
	import { primaryColorBase } from '$lib/app-state';
	import ColorSelect from '$lib/components/ColorSelect/ColorSelect.svelte';
	import EmojiSelect from '$lib/components/EmojiSelect/EmojiSelect.svelte';

	$color = $primaryColorBase;
	$: $primaryColorBase = $color;
</script>

<div class="p-4 space-y-4 card">
	<h1 class="text-lg font-medium">Advanced settings</h1>
	<div class="flex items-center justify-between">
		<span>Pick a custom color</span>
		<ColorSelect bind:value={$color} />
	</div>
	<div class="flex items-center justify-between">
		<span>Set a custom emoji</span>
		<EmojiSelect bind:value={$emoji} />
	</div>
</div>
