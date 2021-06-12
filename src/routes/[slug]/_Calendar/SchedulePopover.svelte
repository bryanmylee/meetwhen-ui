<script lang="ts">
  import type { Interval, ShallowUser } from '$lib/gql/types';
  import { cx } from '$lib/utils/cx';
  import { createPopperActions } from 'svelte-popperjs';
  import { getComplimentUsers } from './state/schedules';

  export let interval: Interval;
  export let users: ShallowUser[];
  $: complimentUsers = $getComplimentUsers(users);

  const HEADER_HEIGHT = 64;
  const [ref, content, getInstance] = createPopperActions({
    strategy: 'absolute',
    placement: 'right',
    modifiers: [
      { name: 'arrow', options: { padding: 16 } },
      { name: 'offset', options: { offset: [0, 12] } },
      {
        name: 'preventOverflow',
        options: {
          altAxis: true,
          padding: { top: HEADER_HEIGHT, right: 12, left: 12 },
        },
      },
    ],
  });

  export let show = false;
  export let fixed = false;

  export let referenceElement: HTMLElement;
  $: if (referenceElement !== undefined) {
    ref(referenceElement);
  }

  export const updateRefPosition = (event: MouseEvent) => {
    const parent = event.target as HTMLDivElement;
    const parentRect = parent.getBoundingClientRect();
    const top = Math.max(0, event.clientY - parentRect.top);
    referenceElement.style.position = 'absolute';
    referenceElement.style.left = '0';
    referenceElement.style.top = `${top}px`;
    updatePopoverPosition();
  };

  export const updatePopoverPosition = () => {
    getInstance()?.update();
  };

  // prettier-ignore
  $: popperClass = cx(
    'popover card pointer-events-none border-3',
    [fixed, 'border-gray-400 z-20', 'border-primary-lighter z-30']
  );

  // prettier-ignore
  $: popoverArrowClass = cx(
    'popover--arrow w-4 h-4 bg-default rounded transform rotate-45',
    [fixed, 'border-gray-400', 'border-primary-lighter']
  )
</script>

{#if show}
  <div use:content class={popperClass}>
    <div data-popper-arrow>
      <div class={popoverArrowClass} />
    </div>
    <h1 class="p-4 text-sm italic">
      {interval.beg.format('HH:mm')} – {interval.end.format('HH:mm')}
    </h1>
    <div class="p-4 border-t border-gray-200 dark:border-gray-600">
      <h2 class="text-sm font-medium">
        {users.length} attending
      </h2>
      <ul class="mt-2 text-sm">
        {#each users as user}
          <li>{user.name}</li>
        {/each}
      </ul>
    </div>
    {#if complimentUsers.length > 0}
      <div class="p-4 border-t border-gray-200 dark:border-gray-600">
        <h2 class="text-sm font-medium">
          {complimentUsers.length} not attending
        </h2>
        <ul class="mt-2 text-sm">
          {#each complimentUsers as user}
            <li>{user.name}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{/if}

<style lang="postcss">
  :global(.popover[data-popper-placement^='right']) {
    & [data-popper-arrow] {
      @apply left-0;
    }
    & .popover--arrow {
      @apply border-l-3 border-b-3;
      translate: calc(-50% - 2px);
    }
  }

  :global(.popover[data-popper-placement^='left']) {
    & [data-popper-arrow] {
      @apply right-0;
    }
    & .popover--arrow {
      @apply border-r-3 border-t-3;
      translate: calc(50% + 2px);
    }
  }
</style>
