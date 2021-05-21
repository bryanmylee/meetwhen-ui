<script lang="ts">
  import { tick } from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { cx } from '$lib/utils/cx';
  import { clickOutside } from '$lib/utils/use-click-outside';
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

  export let disabledItems: unknown[] = [];
  const isDisabled = (item: unknown) => disabledItems.map(getId).includes(getId(item));

  const [ref, popper, getInstance] = createPopperActions<SelectModifiers>();

  let showDropdown = false;

  $: if (showDropdown) {
    tick()
      .then(tick)
      .then(() => {
        getInstance()?.update();
      });
  }

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

  const optionclick = (clickedItem: unknown, clickedIndex: number) => {
    if (isDisabled(clickedItem)) {
      return;
    }
    index = clickedIndex;
    showDropdown = false;
  };

  let refElement: HTMLElement | undefined;
  $: refHeight = refElement?.getBoundingClientRect().height ?? 0;

  const disabledClass = 'text-gray-300 cursor-default';
  const enabledClass =
    'hover:z-10 hover:bg-gray-200 active:z-10 active:bg-gray-400 active:text-white';
</script>

<div
  bind:this={refElement}
  use:ref
  on:click={() => (showDropdown = !showDropdown)}
  on:keydown={keydown}
  tabindex="0"
  class="{className} px-4 py-2 cursor-pointer focusable"
>
  {getDisplay(selected)}
  {#if showDropdown}
    <div
      use:clickOutside={() => (showDropdown = false)}
      use:popper={getOptions(focusedIndex, refHeight)}
      class="relative z-50 overflow-y-auto bg-white max-h-80 card scrollbar-none select-none-all"
    >
      {#each items as item, itemIndex (getId(item))}
        <div
          on:click={() => optionclick(item, itemIndex)}
          class={cx(
            'px-4 py-2 z-0 focusable whitespace-nowrap',
            [isDisabled(item), disabledClass, enabledClass],
            [itemIndex === focusedIndex, 'bg-gray-200'],
            [itemIndex === index, '!bg-primary text-white']
          )}
        >
          {getDisplay(item)}
        </div>
      {/each}
    </div>
  {/if}
</div>
