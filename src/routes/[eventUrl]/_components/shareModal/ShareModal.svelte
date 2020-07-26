<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import CopyIcon from './CopyIcon.svelte';

  const dispatch = createEventDispatcher();

  const hostname = 'meetwhen.io';
  $: url = `${hostname}${window.location.pathname}`;
</script>

<div
  on:click={() => dispatch('dismiss')}
  class="shade"
  transition:fade={{ duration: 200 }}
/>

<div
  class="card outline padded"
  transition:fade={{ duration: 200 }}
>
  <h3>Share this event!</h3>
  <div class="link-container">
    <span>{url}</span>
    <button on:click={() => alert('copied to clipboard!')}>
      <CopyIcon />
    </button>
  </div>
</div>

<style>
  .shade {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

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
    width: 42px;
    height: 42px;
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