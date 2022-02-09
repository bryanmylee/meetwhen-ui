<script lang="ts">
	import type { NavItem } from '../types/NavItem';

	export let navItems: NavItem[];
</script>

<ul class="menu">
	{#each navItems as navItem}
		<li class="contents">
			{#if navItem.type === 'link'}
				<a href={navItem.href} class="w-full block focus rounded-lg">
					{#if navItem.display === 'label'}
						<span
							{...navItem.attributes}
							class="menu-item {navItem.attributes?.class ?? ''}"
						>
							{navItem.label}
						</span>
					{:else}
						<span class="menu-item">
							<svelte:component this={navItem.component} {...navItem.props} />
						</span>
					{/if}
				</a>
			{:else}
				<button on:click={navItem.action} class="w-full block focus rounded-lg">
					{#if navItem.display === 'label'}
						<span
							{...navItem.attributes}
							class="menu-item {navItem.attributes?.class ?? ''}"
						>
							{navItem.label}
						</span>
					{:else}
						<span class="menu-item">
							<svelte:component this={navItem.component} {...navItem.props} />
						</span>
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
		@apply w-full flex justify-center items-center p-2 rounded-lg;
		@apply text-center text-label whitespace-nowrap;
		&:hover {
			@apply bg-shade-200;
		}
		&:active {
			@apply bg-shade-300;
		}
	}
</style>
