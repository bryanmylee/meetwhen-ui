<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import LoadingTextfield from '$lib/components/Loading/LoadingTextfield.svelte';
	import type { AuthModalState } from './state';

	export let isLoggingIn = true;

	const state = getContext<AuthModalState>('state');
	const { name, email, password } = state;
</script>

{#if !isLoggingIn}
	<div transition:slide|local={{ duration: 200 }}>
		<LoadingTextfield
			bind:value={$name.value}
			error={$name.error}
			placeholder="Name"
			required
			class="block"
		/>
	</div>
{/if}
<LoadingTextfield
	bind:value={$email.value}
	error={$email.error}
	placeholder="Email"
	required
	focusOnMount
	class="block"
/>
<LoadingTextfield
	bind:value={$password.value}
	error={$password.error}
	placeholder="Password"
	required
	password
	class="block"
/>
