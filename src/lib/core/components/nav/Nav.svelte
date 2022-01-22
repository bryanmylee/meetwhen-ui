<script lang="ts" context="module">
	export interface NavEvent {
		'open-auth': never;
		'select-theme': {
			theme: ThemeType;
		};
	}
</script>

<script lang="ts">
	import { Button } from '$lib/input';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SafeUser } from '$lib/models/SafeUser';
	import NavMenu from './NavMenu.svelte';
	import type { ThemeType } from '$lib/core/types/ThemeType';

	export let user: Maybe<SafeUser> = undefined;
	export let theme: ThemeType = 'auto';
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
			<NavMenu {user} {theme} on:open-auth on:select-theme />
		</li>
	</ul>
</nav>

<style lang="postcss">
	nav {
		@apply sticky inset-0 bottom-auto;
		@apply flex justify-between items-center gap-2;
		@apply bg-shade-0 shadow-md;
		@apply px-4 py-2;
		@apply z-50;
	}

	.hero {
		@apply text-brand focus-text hover:opacity-50 active:opacity-30;
	}

	.menu-links {
		@apply flex items-center gap-2;
	}
</style>
