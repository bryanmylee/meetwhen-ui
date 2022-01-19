<script lang="ts">
	import { Button } from '$lib/input';
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import AuthDialog from './AuthDialog.svelte';

	let showDialog = true;
</script>

<Meta
	title="Auth/Dialog"
	component={AuthDialog}
	argTypes={{
		onPasswordLogin: { action: 'onPasswordLogin' },
		onOAuthLogin: { action: 'onOAuthLogin' },
	}}
/>

<Story name="Example dialog" let:args>
	<Button on:click={() => (showDialog = !showDialog)}>Log In</Button>
	<AuthDialog
		bind:open={showDialog}
		{...args}
		on:password-login={args.onPasswordLogin}
		on:oauth-login={args.onOAuthLogin}
	/>
</Story>
