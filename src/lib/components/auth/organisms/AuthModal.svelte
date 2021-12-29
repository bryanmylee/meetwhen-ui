<script lang="ts" context="module">
	export interface AuthModalEvent {
		dismiss: {
			authenticated: boolean;
		};
	}
</script>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	import Description from '../atoms/Description.svelte';
	import GuestAccountFields from '../molecues/GuestAccountFields.svelte';
	import IsFullOrGuestControl from '../atoms/IsFullOrGuestControl.svelte';
	import IsLogInOrSignUpControl from '../atoms/IsLogInOrSignUpControl.svelte';
	import { LoadingButton, setLoadingContext, withLoading } from '$lib/components/loading';
	import PlusAccountFields from '../molecues/PlusAccountFields.svelte';
	import type { APIError } from '$lib/gql/error';
	import type { Meeting } from '$lib/gql/types';
	import { clickOutside } from '$lib/utils/actions/use-click-outside';
	import { createEventDispatcher, setContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { getAuthModalState } from '../state';
	import { login } from '$lib/gql/login';
	import { loginGuest } from '$lib/gql/loginGuest';
	import { session } from '$app/stores';
	import { signup } from '$lib/gql/signup';
	import { signupGuest } from '$lib/gql/signupGuest';

	export let activeMeeting: Meeting | null = null;
	export let isLoggingIn = true;
	export let isGuestAuth = false;
	export let enableGuestLogin = true;

	$: {
		isLoggingIn;
		resetErrors();
	}

	$: if (!enableGuestLogin && isLoggingIn && isGuestAuth) {
		isLoggingIn = false;
	}

	const dispatch = createEventDispatcher<AuthModalEvent>();

	const state = getAuthModalState();
	const { name, email, password, resetErrors } = state;
	setContext('state', state);

	const isLoading = setLoadingContext(false);
	const submitAuth = withLoading(isLoading, async () => {
		try {
			if (isLoggingIn) {
				if (isGuestAuth) {
					$session.user = await loginGuest({
						meetingId: activeMeeting!.id,
						username: $name.value,
						password: $password.value,
					});
				} else {
					$session.user = await login({ email: $email.value, password: $password.value });
				}
			} else {
				if (isGuestAuth) {
					$session.user = await signupGuest({
						meetingId: activeMeeting!.id,
						username: $name.value,
						password: $password.value,
					});
				} else {
					$session.user = await signup({
						name: $name.value,
						email: $email.value,
						password: $password.value,
					});
				}
			}
			// wait for withLoading to set loading.
			setTimeout(() => {
				dismiss(true);
			}, 20);
		} catch (errors) {
			console.error(errors);
			if (Array.isArray(errors)) {
				(errors as APIError[]).forEach(handleAPIError);
			}
		}
	});

	const handleAPIError = (error: APIError) => {
		const { id } = error.extensions.exception.details;
		console.error(error);
		if (id === 'auth/user-not-found') {
			if (isGuestAuth) {
				$name.error = 'Guest not found';
			} else {
				$email.error = 'User not found';
			}
		} else if (id === 'auth/missing-email') {
			$email.error = 'Required';
		} else if (id === 'auth/email-already-exists') {
			if (isGuestAuth) {
				$name.error = 'Name already taken';
			} else {
				$email.error = 'Email already taken';
			}
		} else if (id === 'auth/invalid-email') {
			$email.error = 'Badly formatted email';
		} else if (id === 'auth/wrong-password') {
			$password.error = 'Wrong password';
		} else if (id === 'auth/invalid-password') {
			$password.error = 'Password must be at least 6 characters long';
		} else if (id === 'auth/too-many-requests') {
			$password.error = 'Too many attempts';
		}
	};

	const dismiss = (authenticated: boolean) => {
		if ($isLoading) {
			return;
		}
		dispatch('dismiss', { authenticated });
	};
</script>

<div
	transition:fade={{ duration: 200 }}
	class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 !m-0"
>
	<form
		in:fly|local={{ y: 200 }}
		on:submit|preventDefault={submitAuth}
		use:clickOutside={() => dismiss(false)}
		class="m-4 card min-w-96"
	>
		<IsFullOrGuestControl bind:isGuestAuth enableGuestAuth={activeMeeting !== null} />
		<div class="p-4 space-y-4">
			<IsLogInOrSignUpControl bind:isLoggingIn {isGuestAuth} {enableGuestLogin} />
			<Description {isGuestAuth} />
			{#if isGuestAuth}
				<GuestAccountFields />
			{:else}
				<PlusAccountFields {isLoggingIn} />
			{/if}
			<div class="flex space-x-4">
				<LoadingButton
					type="button"
					on:click={() => dismiss(false)}
					class="w-full p-3 rounded-full button shade"
				>
					Cancel
				</LoadingButton>
				<LoadingButton
					type="submit"
					isPrimary
					on:click={submitAuth}
					class="w-full p-3 rounded-full button primary"
				>
					Confirm
				</LoadingButton>
			</div>
		</div>
	</form>
</div>
