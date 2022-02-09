<script lang="ts" context="module">
	export interface NavDropdownEvent {
		dismiss: never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { MenuIcon } from 'svelte-feather-icons';
	import { Button } from '$lib/input';
	import { clickOutside } from '$lib/core/utils/useClickOutside';

	const dispatch = createEventDispatcher<NavDropdownEvent>();

	$: if (!open) {
		dispatch('dismiss');
	}

	let open = false;
</script>

<div class="menu" use:clickOutside={() => (open = false)}>
	<Button color="gray" size="sm" on:click={() => (open = !open)}>
		<MenuIcon class="wh-5" />
	</Button>
	<div class="menu-items-container">
		{#if open}
			<div
				transition:slide|local={{ duration: 300, easing: cubicOut }}
				class="menu-items-reveal"
				on:click={() => (open = false)}
			>
				<div>
					<slot />
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.menu {
		@apply relative;
	}

	.menu-items-container {
		@apply absolute top-full -right-2 mt-2 pt-2;
		@apply rounded-xl shadow-lg z-10;
	}

	.menu-items-reveal {
		@apply p-2 card;
	}
</style>
