<script lang="ts">
  import Grid from '$lib/components/Grid/Grid.svelte';
  import IndexColumnAvailable from './IndexColumnAvailable.svelte';
  import { numRows, availables } from './state';
</script>

<Grid rows={$numRows} class="w-full h-full">
  {#each $availables as available}
    <IndexColumnAvailable {available} />
  {/each}
</Grid>
