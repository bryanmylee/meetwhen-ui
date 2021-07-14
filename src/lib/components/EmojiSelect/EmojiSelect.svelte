<script lang="ts">
  import { clickOutside } from '$lib/utils/actions/use-click-outside';
  import EmojiPicker from './EmojiPicker.svelte';

  export let value = '📘';

  let showPicker = false;

  let className = '';
  export { className as class };
</script>

<div class="relative">
  <button
    type="button"
    tabindex="0"
    on:click={() => (showPicker = !showPicker)}
    class="{className} text-lg px-4 py-2 shade focusable rounded-xl cursor-pointer"
  >
    {value}
  </button>
  {#if showPicker}
    <div
      use:clickOutside={() => setTimeout(() => (showPicker = false), 17)}
      class="absolute right-0 bottom-full"
    >
      <EmojiPicker bind:value />
    </div>
  {/if}
</div>
