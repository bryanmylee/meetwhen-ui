<script lang="ts">
  import ColorSelect from '$lib/components/ColorSelect/ColorSelect.svelte';
  import EmojiSelect from '$lib/components/EmojiSelect/EmojiSelect.svelte';

  let emoji: string;
  let colorHex: string;
</script>

<div class="card p-4 space-y-4">
  <h1 class="font-medium text-lg">Advanced settings</h1>
  <div class="flex justify-between items-center">
    <span>Pick a custom color</span>
    <ColorSelect bind:value={colorHex} />
  </div>
  <div class="flex justify-between items-center">
    <span>Set a custom emoji</span>
    <EmojiSelect bind:value={emoji} />
  </div>
</div>
