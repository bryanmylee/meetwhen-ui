<script>
  import { fade } from 'svelte/transition';

  export let opacity = 0.5;
</script>

<div
  on:click
  class="shade"
  transition:fade={{ duration: 200 }}
  style={`background-color: rgba(0, 0, 0, ${opacity})`}
/>

<style>
  .shade {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>