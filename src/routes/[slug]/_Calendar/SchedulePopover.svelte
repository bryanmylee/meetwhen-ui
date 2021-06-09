<script lang="ts">
  import type { Interval, ShallowUser } from '$lib/gql/types';
  import { createPopperActions } from 'svelte-popperjs';
  import { onMount } from 'svelte';

  export let interval: Interval;
  export let users: ShallowUser[];

  const HEADER_HEIGHT = 64;
  const [ref, content, getInstance] = createPopperActions({
    placement: 'right',
    modifiers: [
      { name: 'offset', options: { offset: [0, 16] } },
      { name: 'preventOverflow', options: { padding: { top: HEADER_HEIGHT } } },
      { name: 'arrow', options: { padding: 16 } },
    ],
  });

  export const updatePopoverPosition = ({ clientX, clientY }: MouseEvent) => {
    virtualElement.getBoundingClientRect = generateGetBoundingClientRect(clientX, clientY);
    getInstance()?.update();
  };

  const generateGetBoundingClientRect = (x = 0, y = 0) => {
    return () =>
      ({
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
      } as DOMRect);
  };

  const virtualElement = {
    getBoundingClientRect: generateGetBoundingClientRect(),
  } as HTMLElement;

  onMount(() => {
    ref(virtualElement);
  });
</script>

<div use:content class="popover card">
  <div data-popper-arrow>
    <div
      class="popover--arrow w-4 h-4 bg-default rounded transform rotate-45 pointer-events-none"
    />
  </div>
  <h1 class="p-4 text-sm italic border-b border-gray-200 dark:border-gray-600">
    {interval.beg.format('HH:mm')} – {interval.end.format('HH:mm')}
  </h1>
  <div class="p-4">
    <h2 class="font-bold text-sm">
      {users.length} attending
    </h2>
    <ul class="mt-2 text-sm">
      {#each users as user}
        <li>{user.name}</li>
      {/each}
    </ul>
  </div>
</div>

<style lang="postcss">
  :global(.popover[data-popper-placement^='right']) {
    & [data-popper-arrow] {
      @apply left-0;
    }
    & .popover--arrow {
      @apply -translate-x-1/3;
    }
  }

  :global(.popover[data-popper-placement^='left']) {
    & [data-popper-arrow] {
      @apply right-0;
    }
    & .popover--arrow {
      @apply translate-x-1/3;
    }
  }
</style>
