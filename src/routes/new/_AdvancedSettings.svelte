<script lang="ts">
  import EmojiSelect from '$lib/components/EmojiSelect/EmojiSelect.svelte';

  let emoji: string;
</script>

<div class="card p-4 space-y-4">
  <div class="flex justify-between items-center flex-1">
    <span>Pick a color</span>
    <input type="color" />
  </div>
  <div class="flex justify-between items-center flex-1">
    <span>Set a custom emoji</span>
    <EmojiSelect bind:value={emoji} />
  </div>
</div>
