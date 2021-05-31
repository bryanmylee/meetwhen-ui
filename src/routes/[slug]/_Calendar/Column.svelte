<script lang="ts">
  import type { Dayjs } from 'dayjs';
  import { availables } from './state';
  import AvailableCell from './AvailableCell.svelte';

  export let x: number;
  export let day: Dayjs;
</script>

{#each $availables as available}
  <AvailableCell {x} {available} />
{/each}
