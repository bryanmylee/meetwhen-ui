<script lang="ts">
  import { clickOutside } from '$lib/utils/actions/use-click-outside';
  import { createPopperActions } from 'svelte-popperjs';
  import EmojiPicker from './EmojiPicker.svelte';

  const [ref, content, getInstance] = createPopperActions({
    strategy: 'absolute',
    placement: 'top-end',
  });

  export let value = '📘';

  let isShowingPicker = false;

  const togglePicker = () => {
    showPicker ? showPicker() : hidePicker();
  };

  const showPicker = () => {
    isShowingPicker = true;
    setTimeout(() => {
      getInstance()?.update();
    }, 16);
  };

  const hidePicker = () => {
    isShowingPicker = false;
  };

  let className = '';
  export { className as class };
</script>

<button
  type="button"
  use:ref
  tabindex="0"
  on:click={togglePicker}
  class="{className} px-4 py-2 shade focusable rounded-xl cursor-pointer"
>
  {value}
</button>
{#if isShowingPicker}
  <div use:content use:clickOutside={() => setTimeout(() => hidePicker(), 50)}>
    <EmojiPicker bind:value />
  </div>
{/if}
