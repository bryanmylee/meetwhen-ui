<script lang="ts" context="module">
	export interface AuthDialogEvent {
		'password-login': {
			email: string;
			password: string;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle,
	} from '@rgossiaux/svelte-headlessui';
	import { Button, Textfield } from '$lib/input';
	import { primaryVars } from '$lib/core/state';

	const dispatch = createEventDispatcher<AuthDialogEvent>();

	export let open = false;

	let email = '';
	let password = '';
	export const handleSubmit = () => {
		dispatch('password-login', { email, password });
	};
</script>

<Dialog {open} on:close={() => (open = false)}>
	<div class="dialog" transition:fade={{ duration: 300 }} style={$primaryVars}>
		<DialogOverlay class="dialog-overlay" />

		<div
			class="dialog-card"
			in:fly={{ duration: 300, delay: 150, y: 50, easing: cubicOut }}
		>
			<DialogTitle as="h1" class="text-xl">Log In</DialogTitle>
			<DialogDescription as="p">
				Track all your meetings in one place.
			</DialogDescription>
			<form on:submit|preventDefault={handleSubmit} class="dialog-form">
				<Textfield bind:value={email} label="Email" required />
				<Textfield bind:value={password} label="Password" required password />
				<div class="dialog-buttons">
					<Button type="submit">Log In</Button>
				</div>
			</form>
		</div>
	</div>
</Dialog>

<style lang="postcss">
	.dialog {
		@apply fixed inset-0 z-10 flex items-center justify-center;
	}

	:global(.dialog-overlay) {
		@apply fixed inset-0 bg-neutral-600/50;
	}

	.dialog-card {
		@apply z-10 p-4 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col gap-4;
	}

	.dialog-form {
		@apply flex flex-col gap-4;
	}

	.dialog-buttons {
		@apply flex gap-4;
	}
</style>
