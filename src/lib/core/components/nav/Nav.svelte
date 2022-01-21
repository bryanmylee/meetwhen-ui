<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
	} from '@rgossiaux/svelte-headlessui';
	import { MenuIcon } from 'svelte-feather-icons';
	import { Button } from '$lib/input';

	const menuItems = [
		{
			href: '/profile',
			label: 'Profile',
		},
		{
			href: '/profile',
			label: 'Profile',
		},
	];
</script>

<nav>
	<div>
		<a href="/" class="hero">meetwhen.io</a>
	</div>
	<ul class="menu-links">
		<li>
			<Button href="/new" size="sm">New</Button>
		</li>
		<li>
			<Menu class="menu" let:open>
				<MenuButton class="menu-button">
					<MenuIcon class="wh-6" />
				</MenuButton>
				<div class="menu-items-container">
					{#if open}
						<div
							transition:slide|local={{ duration: 300, easing: cubicOut }}
							class="menu-items-reveal"
						>
							<MenuItems static class="focus:outline-none">
								{#each menuItems as menuItem}
									<MenuItem let:active as="a" href={menuItem.href}>
										<span class="menu-item" class:active>
											{menuItem.label}
										</span>
									</MenuItem>
								{/each}
							</MenuItems>
						</div>
					{/if}
				</div>
			</Menu>
		</li>
	</ul>
</nav>

<style lang="postcss">
	nav {
		@apply sticky inset-0 bottom-auto;
		@apply flex justify-between items-center gap-2;
		@apply bg-shade-50 shadow-md;
		@apply px-4 py-2;
		@apply z-50;
	}

	.hero {
		@apply text-brand focus-text hover:opacity-50 active:opacity-30;
	}

	.menu-links {
		@apply flex items-center gap-2;
	}

	:global(.menu) {
		@apply relative;
	}

	:global(.menu-button) {
		@apply p-2 flex items-center rounded-xl;
		@apply bg-shade-100 focus transition-colors;
		&:not(:active):hover {
			@apply bg-shade-50 shadow;
		}
		&:active {
			@apply bg-shade-200 shadow-sm;
		}
	}

	.menu-items-container {
		@apply absolute top-full right-0 pt-2;
		@apply rounded-b-xl shadow-xl;
	}

	.menu-items-reveal {
		@apply p-2 rounded-b-xl;
		&:focus-within {
			@apply ring ring-inset ring-primary-400;
		}
	}

	.menu-item {
		@apply block p-2 rounded-lg;
		&:hover {
			@apply bg-shade-100;
		}
		&.active {
			@apply bg-shade-200;
		}
	}
</style>
