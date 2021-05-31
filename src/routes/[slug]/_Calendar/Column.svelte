<script lang="ts">
  import type { Dayjs } from 'dayjs';
  import { availables } from './state';
  import Available from './Available.svelte';

  export let x: number;
  export let day: Dayjs;
</script>

{#each $availables as available}
  <Available {x} {day} {available} />
{/each}
