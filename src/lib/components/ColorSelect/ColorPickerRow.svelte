<script lang="ts">
  import chroma from 'chroma-js';
  import ColorPickerItem from './ColorPickerItem.svelte';

  export let hues: number[];
  export let light: number;
  export let sat: number;
</script>

{#each hues as hue}
  <ColorPickerItem hex={chroma.hsl(hue, sat, light).hex()} on:click />
{/each}
