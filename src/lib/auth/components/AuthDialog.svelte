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
	import { primaryVars } from '$lib/core/state';
	import { withError } from '$lib/core/utils/withError';
	import PasswordLoginForm from './PasswordLoginForm.svelte';

	const dispatch = createEventDispatcher<AuthDialogEvent>();

	export let open = false;

	let email = withError('');
	let password = withError('');
	export const handlePasswordLoginSubmit = () => {
		dispatch('password-login', {
			email: $email.value,
			password: $password.value,
		});
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
			<PasswordLoginForm
				{email}
				{password}
				onSubmit={handlePasswordLoginSubmit}
			/>
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
</style>
