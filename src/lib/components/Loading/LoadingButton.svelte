<script lang="ts" context="module">
  export const IS_LOADING_KEY = 'is-loading';

  export type ButtonType = 'button' | 'submit';
</script>

<script lang="ts">
  import { classes } from '$lib/utils/classes';

  export let type: ButtonType = 'button';
  export let disabled = false;
  export let ariaLabel: string = undefined;
  export let tabindex: number = undefined;

  let isLoading = false;
  export let onClick: (event: MouseEvent) => Promise<void> = undefined;

  const handleClick = async (event: MouseEvent) => {
    if (onClick === undefined) {
      return;
    }
    try {
      isLoading = true;
      await onClick(event);
    } finally {
      isLoading = false;
    }
  };

  let attrs = {};
  $: {
    attrs = {
      type,
      disabled: isLoading || disabled,
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
    isLoading && 'bg-gradient-primary bg-animated-fast !text-white !text-opacity-50',
  ]);
</script>

<button {...attrs} on:click={handleClick} class={buttonClass}>
  <slot />
</button>
