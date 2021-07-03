<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs';

  const [ref, content] = createPopperActions({
    modifiers: [{ name: 'offset', options: { offset: [0, 25] } }],
  });

  let hovering = false;

  let className = '';
  export { className as class };
</script>

<div
  use:ref
  on:blur={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  on:mouseenter={() => (hovering = true)}
  class={className}
>
  <slot name="reference" />
</div>

{#if hovering}
  <div use:content>
    <slot name="tooltip" />
  </div>
{/if}
