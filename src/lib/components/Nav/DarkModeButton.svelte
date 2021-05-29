<script lang="ts">
  import { slide } from 'svelte/transition';
  import { createPopperActions } from 'svelte-popperjs';
  import { isDark } from '$lib/dark-mode';
  import { DropletIcon, MoonIcon, SunIcon } from 'svelte-feather-icons';
  import { cx } from '$lib/utils/cx';

  const [ref, content] = createPopperActions({
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
  });

  let showDropdown = false;

  const options = [
    { title: 'Dark Mode', value: true, icon: MoonIcon },
    { title: 'Light Mode', value: false, icon: SunIcon },
    { title: 'System Setting', value: undefined, icon: DropletIcon },
  ];

  const handleClick = (value: boolean) => {
    $isDark = value;
    showDropdown = false;
  };

  $: activeIcon = $isDark === undefined ? DropletIcon : $isDark ? MoonIcon : SunIcon;

  // prettier-ignore
  const getClassname = (active: boolean) => cx(
    'flex flex-col items-center w-16 p-2 space-y-2 rounded-lg button shade',
    [active, '!text-primary-darker dark:!text-primary']
  );
</script>

<button use:ref on:click={() => (showDropdown = !showDropdown)} class="w-5 h-5 button">
  <svelte:component this={activeIcon} />
</button>
{#if showDropdown}
  <div use:content transition:slide|local={{ duration: 200 }} class="flex p-2 space-x-2 card">
    {#each options as { title, icon, value }}
      <button
        on:click={() => handleClick(value)}
        class={getClassname(value === $isDark)}
        disabled={value === $isDark}
      >
        <svelte:component this={icon} class="w-5 h-5" />
        <p class="text-sm">{title}</p>
      </button>
    {/each}
  </div>
{/if}
