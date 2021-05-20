<script lang="ts">
  import { tick } from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { cx } from '$lib/utils/cx';
  import { keyActions } from './keyboard';
  import { getOptions } from './popper';
  import type { SelectModifiers } from './popper';

  let className = '';
  export { className as class };

  export let index = 0;
  $: focusedIndex = index;

  export let items: unknown[] = [];
  export let selected: unknown;
  export let getDisplay: (item: unknown) => string = (item) => item as string;
  export let getId: (item: unknown) => string = (item) => item as string;

  $: selected = items.length > 0 ? items[index] : null;

  const [ref, popper, getInstance] = createPopperActions<SelectModifiers>();

  let showDropdown = false;
  $: if (showDropdown) {
    tick()
      .then(tick)
      .then(() => {
        getInstance()?.update();
      });
  }
  const optionclick = (clickedIndex: number) => {
    index = clickedIndex;
    showDropdown = false;
  };

  const keydown = (event: KeyboardEvent) => {
    const { key } = event;
    if (Object.keys(keyActions).includes(key)) {
      const result = keyActions[key]([index, focusedIndex, items.length, showDropdown]);
      index = result[0];
      focusedIndex = result[1];
      showDropdown = result[3];
      if (key !== 'Tab') {
        event.preventDefault();
      }
    }
  };

  let refElement: HTMLElement | undefined;
  $: refHeight = refElement?.getBoundingClientRect().height ?? 0;
</script>

<div
  bind:this={refElement}
  tabindex="0"
  use:ref
  on:click={() => (showDropdown = !showDropdown)}
  on:keydown={keydown}
  class="px-4 py-2 cursor-pointer bg-gray-100 rounded-xl focusable {className}"
>
  {getDisplay(selected)}
</div>
{#if showDropdown}
  <div
    use:popper={getOptions(focusedIndex, refHeight)}
    class="relative z-50 overflow-y-auto bg-white max-h-80 card scrollbar-none"
  >
    {#each items as item, itemIndex (getId(item))}
      <div
        on:click={() => optionclick(itemIndex)}
        class={cx(
          'px-4 py-2 z-0 cursor-pointer focusable',
          'hover:z-10 hover:bg-primary-lighter hover:text-white hover:shadow-md-primary',
          'active:z-10 active:bg-primary-darker active:text-white active:shadow-primary',
          [itemIndex === index, 'bg-primary text-white'],
          [itemIndex === focusedIndex, 'bg-primary-lighter text-white shadow-md-primary']
        )}
      >
        {getDisplay(item)}
      </div>
    {/each}
  </div>
{/if}
