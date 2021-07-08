<script lang="ts" context="module">
  export const IS_LOADING_KEY = 'is-loading';

  export type ButtonType = 'button' | 'submit';
</script>

<script lang="ts">
  import { getContext } from 'svelte';

  const isLoading = getContext(IS_LOADING_KEY);

  export let type: ButtonType = 'button';
  export let disabled = false;
  export let ariaLabel: string = undefined;
  export let tabindex: number = undefined;

  let attrs = {};
  $: {
    attrs = {
      type,
      disabled,
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
</script>

<button {...attrs} on:click class={className}>
  <slot />
</button>
