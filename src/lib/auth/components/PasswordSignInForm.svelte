<script lang="ts" context="module">
	export interface PasswordLoginFormEvent {
		submit: never;
		cancel: never;
	}
</script>

<script lang="ts">
	import type { WithErrorable } from '$lib/core/utils/withError';
	import { Button, Textfield } from '$lib/input';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<PasswordLoginFormEvent>();

	export let email: WithErrorable<string>;
	export let password: WithErrorable<string>;
</script>

<form
	on:submit|preventDefault={() => dispatch('submit')}
	class="flex flex-col gap-4"
>
	<Textfield
		bind:value={$email.value}
		error={$email.error}
		label="Email"
		required
	/>
	<Textfield
		bind:value={$password.value}
		error={$password.error}
		label="Password"
		required
		password
	/>
	<div class="flex gap-4">
		<Button type="submit">Sign In</Button>
		<Button color="gray" on:click={() => dispatch('cancel')}>Cancel</Button>
	</div>
</form>
