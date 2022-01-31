<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button } from '$lib/input';
	import AuthDialog from './AuthDialog.svelte';

	let showDialog = true;
</script>

<Meta
	title="Auth/Dialog"
	component={AuthDialog}
	argTypes={{
		onPasswordSignIn: { action: 'onPasswordSignIn' },
		onPasswordCreate: { action: 'onPasswordCreate' },
		onOAuthSignIn: { action: 'onOAuthSignIn' },
	}}
/>

<Story name="Example dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>Log In</Button>
	<AuthDialog
		bind:open={showDialog}
		{...args}
		on:password-signin={args.onPasswordSignIn}
		on:password-create={args.onPasswordCreate}
		on:oauth-signin={args.onOAuthSignIn}
	/>
</Story>
