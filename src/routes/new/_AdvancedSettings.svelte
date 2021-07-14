<script lang="ts">
  import EmojiSelect from '$lib/components/EmojiSelect/EmojiSelect.svelte';

  let emoji: string;
</script>

{emoji}

<EmojiSelect bind:value={emoji} />
