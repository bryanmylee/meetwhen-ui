<script lang="ts">
  import { onMount, tick } from "svelte";
  import { throttle } from "lodash-es";
  import ColorItem from "./ColorItem.svelte";

  let scroller: Element;

  let scrollerWidth = 0;
  $: scrollerHalfWidth = scrollerWidth / 2;
  let scrollerHeight = 0;
  $: scrollerHalfHeight = scrollerHeight / 2;
  let scrollerLeft = 0;
  let scrollerTop = 0;
  function resize() {
    const rect = scroller.getBoundingClientRect();
    scrollerWidth = rect.width;
    scrollerHeight = rect.height;
    scrollerLeft = rect.left;
    scrollerTop = rect.top;
  }

  let scrollerScroll = 0;
  function scroll() {
    scrollerScroll = scroller.scrollLeft;
    trigger();
  }

  export let colors: string[] = [];
  export let index = 0;
  export let color: string;
  $: color = colors[index];

  // set index based on the centered item.
  const trigger = throttle(
    function () {
      const x = scrollerLeft + scrollerHalfWidth;
      const y = scrollerTop + scrollerHalfHeight;
      const items = document.elementsFromPoint(x, y);
      const targets = items
        .filter((item: HTMLElement) => item.dataset.index != null)
        .map((i) => i as HTMLElement);
      if (targets.length === 0) return;
      const selected = targets[0];
      index = parseInt(selected.dataset.index, 10);
    },
    100,
    { trailing: true }
  );

  // set index based on the clicked item.
  function click(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.dataset.index == null) return;
    index = parseInt(target.dataset.index, 10);
    center(index);
  }

  let items: Record<number, Element> = {};
  // center an item.
  function center(i: number, { instant = false } = {}) {
    const { left } = items[i].getBoundingClientRect();
    const scrollTo = left - scrollerLeft - scrollerHalfWidth + scrollerScroll;
    scroller.scrollTo({
      left: scrollTo,
      top: 0,
      behavior: instant ? "auto" : "smooth",
    });
  }

  const keydown = throttle(
    function (event: KeyboardEvent) {
      const { key } = event;
      if (Object.keys(actions).includes(key)) {
        event.preventDefault();
        actions[key]();
        center(index);
      }
    },
    100,
    { trailing: true }
  );

  const actions = {
    ArrowRight: () => {
      if (index >= colors.length - 1) return;
      index++;
    },
    ArrowLeft: () => {
      if (index <= 0) return;
      index--;
    },
  };

  onMount(async () => {
    resize();
    scroll();
    await tick();
    center(index, { instant: true });
  });
</script>

<svelte:window on:resize="{resize}" />

<div class="relative">
  <div class="absolute inset-0 flex justify-center -z-1">
    <div
      tabindex="0"
      on:keydown="{keydown}"
      class="shade w-14 rounded-xl focusable"
    ></div>
  </div>

  <div
    bind:this="{scroller}"
    on:scroll="{scroll}"
    on:click="{click}"
    class="flex py-2 space-x-2 overflow-x-auto snap snap-x snap-mandatory scrollbar-none pl-half"
  >
    {#each colors as color, i}
      <ColorItem
        bind:item="{items[i]}"
        selected="{i === index}"
        index="{i}"
        color="{color}"
        scrollerWidth="{scrollerWidth}"
        scrollerLeft="{scrollerLeft}"
        scrollerScroll="{scrollerScroll}"
      />
    {/each}
    <!-- provide inset for last element -->
    <div class="min-w-full"></div>
  </div>
</div>
