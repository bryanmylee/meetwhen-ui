<script lang="ts">
	import type { WithErrorable } from '$lib/core/utils/withError';
	import { Button, Textfield } from '$lib/input';

	export let email: WithErrorable<string>;
	export let password: WithErrorable<string>;
	export let onSubmit: () => void;
</script>

<form on:submit|preventDefault={onSubmit} class="flex flex-col gap-4">
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
		<Button type="submit">Log In</Button>
	</div>
</form>
