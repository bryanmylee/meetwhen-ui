<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import AuthDialog from './AuthDialog.svelte';
	import { withError } from '$lib/core/utils/withError';

	let showDialog = true;

	const name = withError('');
	const email = withError('');
	const password = withError('');
</script>

<Meta
	title="Auth/AuthDialog"
	component={AuthDialog}
	argTypes={{
		onPasswordSignIn: { action: 'onPasswordSignIn' },
		onPasswordCreate: { action: 'onPasswordCreate' },
		onOAuthSignIn: { action: 'onOAuthSignIn' },
	}}
/>

<Story name="Example dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>Sign In</Button>
	<AuthDialog
		bind:open={showDialog}
		{...args}
		{name}
		{email}
		{password}
		on:password-signin={args.onPasswordSignIn}
		on:password-create={args.onPasswordCreate}
		on:oauth-signin={args.onOAuthSignIn}
	/>
</Story>
