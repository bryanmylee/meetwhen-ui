<script>
  import { createPopperActions } from 'svelte-popperjs';

  import { currentColor } from 'src/stores';

  const [refAction, contentAction] = createPopperActions();

  // PROPS
  // =====
  export let color;
  const { name, hex } = color;

  // STATE
  // =====
  let showName = false;

  // CONSTANTS
  // =========
  const popperOptions = {
    modifiers: [
      { name: 'offset', options: { offset: [0, 4] } },
    ],
  };
</script>

<button
  class:selected={color.hex === $currentColor.hex}
  on:mouseenter={() => showName = true}
  on:mouseleave={() => showName = false}
  on:focus={() => showName = true}
  on:blur={() => showName = false}
  on:click={() => currentColor.setBaseColor(color)}
  use:refAction
  style={`background-color: ${hex}`}
/>
{#if showName}
  <div class="popover" use:contentAction={popperOptions}>
    <div class="popover__content">
      <h5>{name}</h5>
    </div>
  </div>
{/if}

<style>
  button {
    margin-right: 0.5em;
    margin-top: 0.5em;
    width: 2em;
    height: 2em;
    border-radius: 2em;
    border: none;
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

  .popover {
    position: absolute;
    z-index: 90;
  }

  .popover__content {
    z-index: 30;
    width: -moz-max-content;
    width: -webkit-max-content;
    height: -moz-max-content;
    height: -webkit-max-content;
    background-color: var(--bg);
    border: 1px solid var(--grey-300);
    border-radius: 5px;
  }

  h5 {
    margin: 0.5em;
    font-weight: 600;
  }
</style>