<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { SafeUser } from '$lib/models/SafeUser';
	import type { ThemeType } from '$lib/core/types';
	import type { NavEvent } from '../Nav.svelte';
	import ThemeSelect from './ThemeSelect.svelte';

	const dispatch = createEventDispatcher<NavEvent>();

	export let user: Maybe<Nullable<SafeUser>>;
	export let showTheme = false;
	export let selectedTheme: ThemeType;
</script>

<li class="contents">
	{#if user === undefined}
		<button disabled class="menu-item cursor-wait opacity-50"> Sign in </button>
	{:else if user === null}
		<button class="menu-item" on:click={() => dispatch('open-auth')}>
			Sign in
		</button>
	{:else}
		<a href="/profile" class="menu-item">Profile</a>
	{/if}
</li>
<li class="contents">
	<button
		class="menu-item"
		on:click={(event) => {
			event.stopPropagation();
			dispatch('toggle-show-theme');
		}}
	>
		<ThemeSelect
			open={showTheme}
			selected={selectedTheme}
			on:dismiss-theme
			on:select-theme
		/>
	</button>
</li>

<style lang="postcss">
	.menu-item {
		@apply focus;
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
