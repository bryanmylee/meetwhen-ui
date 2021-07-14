<script lang="ts">
  import { clickOutside } from '$lib/utils/actions/use-click-outside';
  import { createPopperActions } from 'svelte-popperjs';
  import EmojiPicker from './EmojiPicker.svelte';

  const [ref, content] = createPopperActions({
    placement: 'top',
  });

  export let value = '📘';

  let showPicker = true;
</script>

<button
  type="button"
  use:ref
  tabindex="0"
  on:click={() => (showPicker = !showPicker)}
  class="px-4 py-2 shade focusable rounded-xl cursor-pointer"
>
  {value}
</button>
{#if showPicker}
  <div use:content use:clickOutside={() => setTimeout(() => (showPicker = false), 50)}>
    <EmojiPicker bind:value />
  </div>
{/if}
