<script lang="ts">
	import {
		signInWithEmailAndPassword,
		signInWithPopup,
		signOut,
	} from 'firebase/auth';
	import { getFirebaseAuth, getUser } from '$lib/firebase';
	import { Button, Textfield } from '$lib/input';
	import { googleProvider } from '$lib/auth/providers';

	const auth = getFirebaseAuth();
	const user = getUser();

	$: if ($user?.ssr) {
		console.log('SSR-ed User:', $user);
	} else {
		console.log('Hydrated User:', $user);
	}

	let email = '';
	let password = '';
	const handleLogin = async () => {
		const credential = await signInWithEmailAndPassword(auth, email, password);
		console.log('Cred:', credential);
	};

	const handleLogout = async () => {
		await signOut(auth);
	};

	const handleGoogleLogin = async () => {
		const credential = await signInWithPopup(auth, googleProvider);
		console.log('Google Cred:', credential);
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
			<Button type="submit">Login</Button>
			<Button color="gray" on:click={handleLogout}>Logout</Button>
		</div>
	</form>
	<Button on:click={handleGoogleLogin}>Google Login</Button>
</div>

<div class="flex flex-col gap-4 p-4">
	{#if $user}
		Logged in as {$user.email}
	{/if}
	<a href="/protected">Go to protected</a>
</div>
