<script lang="ts">
  import { tick } from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import sameWidth from '@my/utils/popper/sameWidth';
  import scrollToNthChild from '@my/utils/popper/scrollToNthChild';
  import type { OptionsGeneric, StrictModifiers } from '@popperjs/core';
  import type { SameWidthModifier } from '@my/utils/popper/sameWidth';
  import type { ScrollToNthChildModifier } from '@my/utils/popper/scrollToNthChild';

  let className = 'select';
  export { className as class };
  export let dropclass = 'select-drop';
  export let optionclass = 'select-option';
  export let optionclass_selected = 'select-option--selected';
  export let optionclass_focused = 'select-option--focused';

  export let options: any[] = [''];
  export let selected: any;
  export let index = 0;
  $: selected = options[index];

  type ExtendedModifiers = StrictModifiers
      | SameWidthModifier
      | ScrollToNthChildModifier;
  const [ref, popper, getInstance] = createPopperActions<ExtendedModifiers>();
  let popperOptions: OptionsGeneric<ExtendedModifiers>;
  $: popperOptions = {
    placement: 'bottom',
    strategy: 'fixed',
    modifiers: [
      sameWidth,
      {...scrollToNthChild, options: {
        childIndex: focusedIndex,
      }},
      { name: 'offset', options: {
        offset: [0, -refHeight],
      }},
    ],
  };

  let showDrop = false;
  $: if (showDrop) {
    tick().then(tick).then(() => {
      getInstance()?.update();
    });
  }
  function optionclick(clickedIndex: number) {
    index = clickedIndex;
    showDrop = false;
  }

  let refElement: Element;
  $: refHeight = refElement?.getBoundingClientRect().height ?? 0;

  const decremented = (n: number) => n === 0 ? n : n - 1;
  const incremented = (n: number, max: number) => n === max ? n : n + 1;

  $: focusedIndex = index;
  async function keydown(event: KeyboardEvent) {
    const { key } = event;
    if (Object.keys(actions).includes(key)) {
      actions[key]();
      if (key !== 'Tab') {
        event.preventDefault();
      }
    }
  }

  const actions = {
    ArrowUp: () => {
      if (showDrop) { focusedIndex = decremented(focusedIndex) }
      else { index = decremented(index) }
    },
    ArrowDown: () => {
      if (showDrop) { focusedIndex = incremented(focusedIndex, options.length - 1) }
      else { index = incremented(index, options.length - 1) }
    },
    Escape: () => {
      showDrop = false;
    },
    Tab: () => {
      if (showDrop) { index = focusedIndex }
      showDrop = false;
    },
    ' ': () => {
      if (showDrop) { index = focusedIndex }
      else { focusedIndex = index }
      showDrop = !showDrop;
    },
    get Enter() { return this[' '] },
  };

</script>

<div
  bind:this={refElement}
  tabindex=0
  use:ref
  on:click={() => showDrop = !showDrop}
  on:keydown={keydown}
  class={className}
  >
  {selected}
</div>
{#if showDrop}
  <div
    use:popper={popperOptions}
    class={dropclass}
    >
    {#each options as option, i}
      <div
        tabindex=-1
        on:click={() => optionclick(i)}
        class={`
          ${optionclass}
          ${i === index ? optionclass_selected : ''}
          ${i === focusedIndex ? optionclass_focused : ''}
        `.replace(/\s\s+/g, ' ')}>
        {option}
      </div>
    {/each}
  </div>
{/if}

