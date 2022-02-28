<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { mockHydratedUser } from '$lib/test/mockUser';
	import Nav from './Nav.svelte';

	let theme = 'auto';
</script>

<Meta
	title="Core/Nav"
	component={Nav}
	argTypes={{
		onOpenAuth: { action: 'onOpenAuth' },
		onSelectTheme: { action: 'onSelectTheme' },
	}}
/>

<Story name="With hydrated user" let:args>
	<Nav
		{...args}
		user={mockHydratedUser}
		{theme}
		on:open-auth={args.onOpenAuth}
		on:select-theme={(e) => (theme = e.detail.theme)}
	/>
</Story>

<Story name="Without user" let:args>
	<Nav
		{...args}
		{theme}
		on:open_auth={args.onOpenAuth}
		on:select-theme={(e) => (theme = e.detail.theme)}
	/>
</Story>
