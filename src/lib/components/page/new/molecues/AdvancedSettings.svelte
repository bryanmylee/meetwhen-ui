<script lang="ts">
	import { ColorPickerButton } from '$lib/components/color-picker';
	import { EmojiPickerButton } from '$lib/components/emoji-picker';

	export let emoji: string;
	export let color: string;
</script>

<div class="p-4 space-y-4 card">
	<h1 class="text-lg font-medium">Advanced settings</h1>
	<div class="flex items-center justify-between">
		<span>Pick a custom color</span>
		<ColorPickerButton bind:value={color} />
	</div>
	<div class="flex items-center justify-between">
		<span>Set a custom emoji</span>
		<EmojiPickerButton bind:value={emoji} />
	</div>
</div>
