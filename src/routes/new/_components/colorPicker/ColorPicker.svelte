<script>
  import { colors } from 'src/stores';

  import Color from './Color.svelte';
</script>

<div class="card outline padded">
  <h3>Pick a color</h3>
  <div class="container">
    {#each Object.entries(colors) as [colorId, color] (colorId)}
      <Color {color} />
    {/each}
  </div>
</div>

<style>
  .container {
    margin-right: -0.5em;
    display: flex;
    flex-flow: row wrap;
    justify-content: start;
  }
</style>