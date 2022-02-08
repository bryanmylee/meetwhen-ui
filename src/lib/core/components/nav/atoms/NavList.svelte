<script lang="ts">
	import type { NavItem } from '../types/NavItem';

	export let navItems: NavItem[];
</script>

<ul class="menu">
	{#each navItems as navItem}
		<li class="contents">
			{#if navItem.type === 'link'}
				<a href={navItem.href} class="menu-item">
					{#if navItem.display === 'label'}
						{navItem.label}
					{:else}
						<svelte:component this={navItem.component} {...navItem.props} />
					{/if}
				</a>
			{:else}
				<button on:click={navItem.action} class="menu-item">
					{#if navItem.display === 'label'}
						{navItem.label}
					{:else}
						<svelte:component this={navItem.component} {...navItem.props} />
					{/if}
				</button>
			{/if}
		</li>
	{/each}
</ul>

<style lang="postcss">
	.menu {
		@apply flex items-center;
	}

	.menu-item {
		@apply w-full flex justify-center items-center p-2 rounded-lg focus;
		@apply text-center text-label whitespace-nowrap;
		&:hover {
			@apply bg-shade-200;
		}
		&:active {
			@apply bg-shade-300;
		}
	}
</style>
