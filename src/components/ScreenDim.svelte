<script>
  import { fade } from 'svelte/transition';
</script>

<div
  on:click
  class="shade"
  transition:fade={{ duration: 200 }}
/>

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
</style>