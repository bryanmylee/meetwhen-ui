<script lang="ts" context="module">
  export type ButtonType = 'button' | 'submit';
</script>

<script lang="ts">
  import { classes } from '$lib/utils/classes';
  import { getLoadingContext } from './index';

  export let type: ButtonType = 'button';
  export let disabled = false;
  export let ariaLabel: string = undefined;
  export let tabindex: number = undefined;

  const isLoading = getLoadingContext();

  let attrs = {};
  $: {
    attrs = {
      type,
      disabled: $isLoading || disabled,
    };
    if (ariaLabel !== undefined) {
      attrs['aria-label'] = ariaLabel;
    }
    if (tabindex !== undefined) {
      attrs['tabindex'] = tabindex;
    }
  }

  let className = '';
  export { className as class };
  $: buttonClass = classes([
    className,
    $isLoading && 'bg-gradient-primary bg-animated-fast !text-white !text-opacity-50',
  ]);
</script>

<button {...attrs} on:click class={buttonClass}>
  <slot />
</button>
