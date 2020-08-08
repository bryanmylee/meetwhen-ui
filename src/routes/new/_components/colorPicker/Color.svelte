<script>
  import { createPopperActions } from 'svelte-popperjs';

  import { currentColor } from 'src/stores';

  import Tooltip from 'src/components/ui/Tooltip.svelte';

  const [popperRef, popperContent] = createPopperActions();

  // PROPS
  // =====
  export let color;
  const { name, hex } = color;

  // STATE
  // =====
  let showName = false;
</script>

<button
  class:selected={color.hex === $currentColor.hex}
  on:mouseenter={() => showName = true}
  on:mouseleave={() => showName = false}
  on:focus={() => showName = true}
  on:blur={() => showName = false}
  on:click={() => currentColor.setBaseColor(color)}
  use:popperRef
  style={`background-color: ${hex}`}
/>
{#if showName}
  <Tooltip use={popperContent}>
    <h5>{name}</h5>
  </Tooltip>
{/if}

<style>
  button {
    margin-right: 0.5em;
    margin-top: 0.5em;
    width: 2em;
    height: 2em;
    border-radius: 2em;
    border: none;
    cursor: pointer;
  }

  button:hover, button:focus {
    box-shadow: var(--shadow-small);
  }

  button:active {
    box-shadow: none;
  }

  button.selected {
    border: 2px solid var(--bg);
    box-shadow: 0 0 0 2px var(--primary-500);
  }

  h5 {
    margin: 0.5em;
  }
</style>