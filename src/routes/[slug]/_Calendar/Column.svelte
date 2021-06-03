<script lang="ts">
  import type { Dayjs } from 'dayjs';
  import { availables } from './state/intervals';
  import Available from './Available.svelte';

  export let day: Dayjs;
</script>

{#each $availables as available}
  <Available {day} {available} />
{/each}
