<script lang="ts">
  import { cubicIn, cubicOut } from "svelte/easing";

  export let selected = false;
  export let index: number;
  export let color: string;
  export let scrollerWidth = 0;
  export let scrollerLeft = 0;
  export let scrollerScroll = 0;

  export let item: Element = null;
  $: percentOffset = getPercentOffset(scrollerScroll);
  function getPercentOffset(_: number) {
    if (item == null) return 0;
    const { left, width } = item.getBoundingClientRect();
    return (left - scrollerLeft + width / 2) / scrollerWidth;
  }
  $: centerOffset = Math.abs(percentOffset * 2 - 1);
  let style = "";
  $: if (centerOffset <= 1) {
    style = `
      background-color: ${color};
      transform: scale(${1 - cubicOut(centerOffset) / 2});
      opacity: ${1 - cubicIn(centerOffset)};
    `;
  }
</script>

<div
  bind:this="{item}"
  data-index="{index}"
  on:click
  class="h-10 overflow-visible cursor-pointer min-w-10 snap-center"
>
  <div
    data-index="{index}"
    class="{`w-full h-full rounded-full ${
      selected ? 'shadow-md-primary' : ''
    }`}"
    style="{style}"
  ></div>
</div>
