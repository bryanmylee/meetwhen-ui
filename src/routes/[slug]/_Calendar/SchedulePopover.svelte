<script lang="ts">
  import type { Interval, ShallowUser } from '$lib/gql/types';
  import { createPopperActions } from 'svelte-popperjs';
  import { onMount } from 'svelte';

  export let interval: Interval;
  export let users: ShallowUser[];

  const [ref, content, getInstance] = createPopperActions({
    modifiers: [{ name: 'offset', options: { offset: [0, 20] } }],
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

<div use:content>
  <div class="card p-4">
    <ul>
      {#each users as user}
        <li class="text-sm font-medium">{user.name}</li>
      {/each}
    </ul>
  </div>
</div>
