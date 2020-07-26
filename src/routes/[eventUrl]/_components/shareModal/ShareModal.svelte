<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import ScreenDim from 'src/components/ScreenDim.svelte';
  import CopyIcon from './CopyIcon.svelte';
  import Toast from 'src/components/Toast.svelte';

  const dispatch = createEventDispatcher();

  const hostname = 'meetwhen.io';
  $: url = `${hostname}${window.location.pathname}`;

  // STATE
  // =====
  let message = '';

  // FUNCTIONS
  // =========
  async function copyToClipboard() {
    await navigator.clipboard.writeText(url);
    message = 'Copied to clipboard!';
    dispatch('copy', { url });
  }
</script>

<ScreenDim on:click={() => dispatch('dismiss')} />
<div
  class="card outline padded"
  transition:fly={{ y: 300, duration: 400, easing: cubicOut }}
>
  <h3>Share this event!</h3>
  <div class="link-container">
    <span on:click={copyToClipboard}>{url}</span>
    <button on:click={copyToClipboard}>
      <CopyIcon />
    </button>
  </div>
</div>
<Toast bind:message={message} />

<style>
  .card {
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 91;
    display: flex;
    flex-direction: column;
    background: var(--primary-700);
    background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-gradient-dark) 100%);
    border: none;
  }

  .link-container {
    margin: 1em 0 0;
    display: flex;
  }

  span {
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 0.5em;
    background-color: var(--primary-400);
    -webkit-touch-callout: all;
    -webkit-user-select: all;
  }

  button {
    width: 40px;
    height: 40px;
    margin-left: 0.5em;
    padding: 0.5em;
    border-radius: 1.5em;
    background-color: transparent;
    border: none;
    outline: none;
    opacity: 80%;
    transition: all 200ms ease;
  }

  button:hover, button:focus {
    background-color: var(--primary-400);
  }

  button:active {
    background-color: var(--primary-600);
  }
</style>