<script lang="ts">
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import { getFirebaseAuth, getUser } from '$lib/firebase';
	import { Button, Textfield } from '$lib/input';

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
</script>

<form
	on:submit|preventDefault={handleLogin}
	class="flex flex-col items-start gap-4 p-4"
>
	<h1>Login</h1>
	<Textfield bind:value={email} label="Email" required />
	<Textfield bind:value={password} label="Password" required password />
	<div class="flex gap-4">
		<Button type="submit">Login</Button>
		<Button color="gray" on:click={handleLogout}>Logout</Button>
	</div>
</form>
