<script lang="ts">
	import {
		createUserWithEmailAndPassword,
		signInAnonymously,
		signInWithEmailAndPassword,
		signInWithRedirect,
		signOut,
	} from 'firebase/auth';
	import { getFirebaseAuth, getUser } from '$lib/firebase';
	import { Button, Textfield } from '$lib/input';
	import {
		googleProvider,
		appleProvider,
		twitterProvider,
		githubProvider,
	} from '$lib/auth/providers';

	const auth = getFirebaseAuth();
	const user = getUser();

	$: if ($user?.ssr) {
		console.log('SSR-ed User:', $user);
	} else {
		console.log('Hydrated User:', $user);
	}

	let email = '';
	let password = '';

	const handleSignup = async () => {
		const credential = createUserWithEmailAndPassword(auth, email, password);
		console.log('New Cred:', credential);
	};

	const handleLogin = async () => {
		const credential = await signInWithEmailAndPassword(auth, email, password);
		console.log('Cred:', credential);
	};

	const handleLogout = async () => {
		await signOut(auth);
	};

	const handleAnonLogin = async () => {
		if ($user === undefined) {
			const credential = await signInAnonymously(auth);
			console.log('Guest Cred:', credential);
		}
	};

	const handleGoogleLogin = async () => {
		if ($user === undefined) {
			const credential = await signInWithRedirect(auth, googleProvider);
			console.log('Google Cred:', credential);
		}
	};

	const handleAppleLogin = async () => {
		if ($user === undefined) {
			const credential = await signInWithRedirect(auth, appleProvider);
			console.log('Apple Cred:', credential);
		}
	};

	const handleTwitterLogin = async () => {
		if ($user === undefined) {
			const credential = await signInWithRedirect(auth, twitterProvider);
			console.log('Twitter Cred:', credential);
		}
	};

	const handleGithubLogin = async () => {
		if ($user === undefined) {
			const credential = await signInWithRedirect(auth, githubProvider);
			console.log('Github Cred:', credential);
		}
	};
</script>

<div class="flex flex-col items-start gap-4 p-4">
	<form
		on:submit|preventDefault={handleLogin}
		class="flex flex-col items-start gap-4"
	>
		<h1>Login</h1>
		<Textfield bind:value={email} label="Email" required />
		<Textfield bind:value={password} label="Password" required password />
		<div class="flex gap-4">
			<Button on:click={handleSignup}>Signup</Button>
			<Button type="submit">Login</Button>
			<Button color="gray" on:click={handleLogout}>Logout</Button>
		</div>
	</form>
	<Button on:click={handleAnonLogin}>Guest Login</Button>
	<Button on:click={handleGoogleLogin}>Google Login</Button>
	<Button on:click={handleAppleLogin}>Apple Login</Button>
	<Button on:click={handleTwitterLogin}>Twitter Login</Button>
	<Button on:click={handleGithubLogin}>Github Login</Button>
</div>

<div class="flex flex-col gap-4 p-4">
	{#if $user}
		Logged in as {$user.email}
	{/if}
	<a href="/protected">Go to protected</a>
</div>
