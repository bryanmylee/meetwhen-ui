<script>
  import { onMount } from 'svelte';

  export let disabled = false;
  export let fakeDisabled = false;
  export let iconOnly = false;
  export let style = '';

  let button;
  onMount(() => {
    setTimeout(() => {
      button.classList.add('pulse');
    }, 200);
  });
</script>

<button
  bind:this={button}
  {style}
  {disabled}
  on:click
  class="no-highlight"
  class:fake-disabled={fakeDisabled}
  class:icon-only={iconOnly}
  {...$$props}
>
  <slot/>
</button>

<style>
  button {
    position: relative;
    margin: 0;
    border: 0;
    color: var(--primary-text);
    background-color: var(--primary-500);
    padding: 0.8em 1em;
    border-radius: 1.4em;
    box-sizing: border-box;
    transition: all 200ms ease;
    cursor: pointer;
    height: min-content;
    overflow: hidden;
    /* Fix for Safari overflow: hidden not applying to border radii */
    -webkit-mask-image: -webkit-radial-gradient(white, black);
  }

  button::after {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255,255,255,0.4);
  }

  button.pulse::after {
    animation: pulse 2s infinite;
  }

  button:focus, button:hover {
    background-color: var(--primary-400);
    outline: none;
    box-shadow: var(--shadow-small);
  }

  button:active {
    background-color: var(--primary-600);
    transform: scale(0.98);
    box-shadow: none;
  }

  button:disabled, button.fake-disabled {
    cursor: unset;
    box-shadow: none;
    background-color: var(--grey-400);
    transform: none;
  }

  button.icon-only {
    width: 2.8em;
    height: 2.8em;
    padding: 0.7em;
  }

  @keyframes pulse {
    from {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    to { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
/*
  @-o-keyframes pulse {
    from {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    70% { transform: translate(-50%, -50%) scale(1); }
    to { opacity: 0; }
  }

  @-moz-keyframes pulse {
    from {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    70% { transform: translate(-50%, -50%) scale(1); }
    to { opacity: 0; }
  }

  @-webkit-keyframes pulse {
    from {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    70% { transform: translate(-50%, -50%) scale(1); }
    to { opacity: 0; }
  } */
</style>
