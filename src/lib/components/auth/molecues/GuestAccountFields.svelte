<script lang="ts">
	import { LoadingTextfield } from '$lib/components/loading';
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
	placeholder="Password (optional)"
	password
	class="block"
/>
<p class="text-xs italic text-gray-400">A password will be required to edit your schedule.</p>
