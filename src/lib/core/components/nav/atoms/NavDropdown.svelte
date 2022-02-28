<script lang="ts" context="module">
	export interface NavDropdownEvent {
		dismiss: never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { MenuIcon } from 'svelte-feather-icons';
	import { clickOutside } from '$lib/core/actions';

	const dispatch = createEventDispatcher<NavDropdownEvent>();

	$: if (!open) {
		dispatch('dismiss');
	}

	let open = false;
</script>

<label class="menu" use:clickOutside={() => (open = false)}>
	<input type="checkbox" class="menu-checkbox" bind:checked={open} />
	<div class="menu-button">
		<MenuIcon class="wh-5" />
	</div>
	<div class="menu-items-container">
		<ul class="menu-items-reveal" on:click={() => (open = false)}>
			<slot />
		</ul>
	</div>
</label>

<style lang="postcss">
	.menu {
		@apply block relative cursor-pointer w-12 h-9 rounded-full;
	}

	.menu-checkbox {
		@apply absolute opacity-0 wh-0;
	}

	.menu-button {
		@apply absolute inset-0 rounded-full bg-shade-100 transition;
		&:hover {
			@apply bg-shade-50 shadow;
		}
		&:active {
			@apply bg-shade-200;
		}
		.menu-checkbox:focus ~ & {
			@apply ring ring-primary-400 ring-offset-2 gdark:ring-offset-neutral-800;
		}
		@apply flex justify-center items-center;
	}

	.menu-items-container {
		@apply hidden;
		.menu-checkbox:checked ~ & {
			@apply block;
			@apply absolute top-full -right-2 mt-2 pt-2;
			@apply rounded-xl shadow-lg z-10;
		}
	}

	.menu-items-reveal {
		@apply p-2 card;
	}
</style>
