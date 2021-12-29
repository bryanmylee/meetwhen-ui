<script lang="ts">
	import { slide } from 'svelte/transition';
	import { media } from '$lib/app-state';
	import { classes } from '$lib/utils/classes';
	import { clickOutside } from '$lib/utils/actions/use-click-outside';
	import { MenuIcon } from 'svelte-feather-icons';

	export let key: string;

	let dropdownExpanded = false;
	$: if (!$media.sm) {
		dropdownExpanded = false;
	}

	const closeDropdown = () => {
		dropdownExpanded = false;
	};
	$: key && closeDropdown();
</script>

<nav
	class={classes(
		'fixed inset-0 bottom-auto z-50 rounded-t-none transition-shadow duration-300',
		key !== '/' && 'card'
	)}
>
	<div class="flex items-center justify-between h-16 mx-auto max-w-7xl dark:text-white">
		<ul class="flex items-center p-4">
			{#if key !== '/'}
				<slot name="left" />
			{/if}
		</ul>
		{#if $media.sm}
			<ul class="flex items-center p-4 space-x-2">
				<slot name="right" />
				<slot name="right-collapsable" />
			</ul>
		{:else}
			<ul class="flex items-center p-4">
				<slot name="right" />
				<div use:clickOutside={closeDropdown} class="relative">
					<button on:click={() => (dropdownExpanded = !dropdownExpanded)} class="nav-item">
						<MenuIcon class="w-5 h-5" />
					</button>
					{#if dropdownExpanded}
						<ul
							transition:slide={{ duration: 200 }}
							class="absolute right-0 flex flex-col items-stretch w-32 p-2 top-12 card"
						>
							<slot name="right-collapsable" />
						</ul>
					{/if}
				</div>
			</ul>
		{/if}
	</div>
</nav>
