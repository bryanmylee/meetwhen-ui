<script lang="ts" context="module">
	export const load: Load = async ({ url }) => {
		const backRoute = url.searchParams.get('back') ?? '/';
		return {
			props: {
				backRoute,
			},
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { Load } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { AuthCard } from '$lib/auth/components/authDialog';
	import type { AuthEvent } from '$lib/auth/components/authDialog';
	import Head from '$lib/core/components/Head.svelte';
	import { oAuthSignIn, passwordSignIn } from '$lib/auth/utils/handleSignIn';
	import { useAuth, useUser } from '$lib/firebase/context';

	const auth = useAuth();
	const user = useUser();

	export let backRoute: string;

	const handlePasswordSignIn = async ({
		detail,
	}: CustomEvent<AuthEvent['password-signin']>) => {
		if ($user?.ssr) {
			return;
		}
		await passwordSignIn(auth, {
			currentUser: $user,
			email: detail.email,
			password: detail.password,
		});
	};

	const handleOAuthSignIn = async ({
		detail,
	}: CustomEvent<AuthEvent['oauth-signin']>) => {
		if ($user?.ssr) {
			return;
		}
		await oAuthSignIn(auth, {
			currentUser: $user,
			providerType: detail.providerType,
		});
	};

	onMount(() => {
		user.subscribe(($user) => {
			if ($user != null) {
				goto(backRoute);
			}
		});
	});
</script>

<Head subtitle="login" />

<section class:loading={$user === undefined}>
	<div class="w-full max-w-xl md:max-w-3xl p-4 mx-auto">
		<AuthCard
			on:password-signin={handlePasswordSignIn}
			on:oauth-signin={handleOAuthSignIn}
		/>
	</div>
</section>

<style lang="postcss">
	section {
		@apply transition-opacity;
		&.loading {
			@apply opacity-50 pointer-events-none;
		}
	}
</style>
