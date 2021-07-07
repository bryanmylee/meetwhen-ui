<script lang="ts">
  import { slide } from 'svelte/transition';
  import { createPopperActions } from 'svelte-popperjs';
  import { isDark } from '$lib/dark-mode';
  import { clickOutside } from '$lib/utils/use-click-outside';
  import { classes } from '$lib/utils/classes';
  import { DropletIcon, MoonIcon, SunIcon } from 'svelte-feather-icons';

  const [ref, content] = createPopperActions({
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
  });

  let showDropdown = false;

  const options = [
    { title: 'Dark', value: true, icon: MoonIcon },
    { title: 'Light', value: false, icon: SunIcon },
    { title: 'Auto', value: undefined, icon: DropletIcon },
  ];

  const handleClick = (value: boolean) => {
    $isDark = value;
  };

  $: activeIcon = $isDark === undefined ? DropletIcon : $isDark ? MoonIcon : SunIcon;

  const contentClassName = (active: boolean) =>
    classes([
      'flex flex-col items-center w-16 p-2 space-y-2 rounded-lg button shade',
      active && '!text-primary-darker dark:!text-primary',
    ]);
</script>

<button
  type="button"
  aria-label="Show theme panel"
  use:ref
  on:click={() => (showDropdown = !showDropdown)}
  class="w-5 h-5 text-focusable"
>
  <svelte:component
    this={activeIcon}
    class={classes(['hover:text-primary', showDropdown && 'text-primary'])}
  />
</button>

{#if showDropdown}
  <div
    use:content
    use:clickOutside={() => setTimeout(() => (showDropdown = false))}
    transition:slide|local={{ duration: 200 }}
    class="flex p-2 space-x-2 card"
  >
    {#each options as { title, icon, value }}
      <button
        type="button"
        aria-label={title}
        on:click={() => handleClick(value)}
        class={contentClassName(value === $isDark)}
        disabled={value === $isDark}
      >
        <svelte:component this={icon} class="w-5 h-5 min-w-5 min-h-5" />
        <p class="text-sm">{title}</p>
      </button>
    {/each}
  </div>
{/if}
