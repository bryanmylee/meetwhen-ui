<script lang="ts">
	import type { DarkModeSetting } from '$lib/utils/stores/dark-mode-store';
	import { DropletIcon, MoonIcon, SunIcon } from 'svelte-feather-icons';
	import { classes } from '$lib/utils/classes';
	import { clickOutside } from '$lib/utils/actions/use-click-outside';
	import { createPopperActions } from 'svelte-popperjs';
	import { darkModeSetting } from '$lib/app-state';
	import { slide } from 'svelte/transition';

	const [ref, content] = createPopperActions({
		modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
	});

	let showDropdown = false;

	interface Option {
		title: string;
		value: DarkModeSetting;
		icon: any;
	}

	const options: Option[] = [
		{ title: 'Dark', value: 'dark', icon: MoonIcon },
		{ title: 'Light', value: 'light', icon: SunIcon },
		{ title: 'Auto', value: 'auto', icon: DropletIcon },
	];

	const handleClick = (value: DarkModeSetting) => {
		$darkModeSetting = value;
	};

	$: activeIcon =
		$darkModeSetting === 'auto' ? DropletIcon : $darkModeSetting === 'dark' ? MoonIcon : SunIcon;

	const contentClassName = (active: boolean) =>
		classes([
			'flex flex-col items-center w-16 p-2 space-y-2 rounded-lg button shade',
			active && '!text-primary-darker dark:!text-primary',
		]);

	let className = '';
	export { className as class };
</script>

<button
	type="button"
	aria-label="Show theme panel"
	use:ref
	on:click={() => (showDropdown = !showDropdown)}
	class={className}
>
	<svelte:component
		this={activeIcon}
		class={classes(['w-5 h-5', showDropdown && 'text-primary'])}
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
				class={contentClassName(value === $darkModeSetting)}
				disabled={value === $darkModeSetting}
			>
				<svelte:component this={icon} class="w-5 h-5 min-w-5 min-h-5" />
				<p class="text-sm">{title}</p>
			</button>
		{/each}
	</div>
{/if}
