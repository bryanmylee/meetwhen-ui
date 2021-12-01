<script lang="ts">
	import LoadingTextfield from '$lib/components/loading/molecues/LoadingTextfield.svelte';
	import type { AuthModalState } from '../state';
	import { getContext } from 'svelte';

	const state = getContext<AuthModalState>('state');
	const { name, password } = state;
</script>

<LoadingTextfield
	bind:value={$name.value}
	error={$name.error}
	placeholder="Username"
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
