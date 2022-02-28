<script lang="ts" context="module">
	export interface PasswordCreateFormEvent {
		submit: never;
		cancel: never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusOnMount } from '$lib/core/actions';
	import type { WithErrorable } from '$lib/core/utils/withError';
	import { Button, LoadingButton, Textfield } from '$lib/input';

	const dispatch = createEventDispatcher<PasswordCreateFormEvent>();

	export let name: WithErrorable<string>;
	export let email: WithErrorable<string>;
	export let password: WithErrorable<string>;
</script>

<form
	on:submit|preventDefault={() => dispatch('submit')}
	class="flex flex-col gap-4"
>
	<Textfield
		bind:value={$name.value}
		error={$name.error}
		label="Name"
		required
		use={[[focusOnMount, { delay: 17 }]]}
	/>
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
	<div class="flex gap-4 justify-stretch">
		<Button
			color="gray"
			size="md"
			class="flex-1"
			on:click={() => dispatch('cancel')}
		>
			Cancel
		</Button>
		<LoadingButton type="submit" size="md" color="gradient" class="flex-1">
			Create account
		</LoadingButton>
	</div>
</form>
