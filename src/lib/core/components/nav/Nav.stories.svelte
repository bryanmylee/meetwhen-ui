<script lang="ts">
	import { readable } from 'svelte/store';
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { setUser } from '$lib/firebase/context';
	import { mockHydratedUser } from '$lib/test/mockUser';
	import Nav from './Nav.svelte';

	setUser(readable(mockHydratedUser));
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
		on:open-auth={args.onOpenAuth}
		on:select-theme={args.onSelectTheme}
	/>
</Story>

<Story name="Without user" let:args>
	<Nav {...args} on:open_auth={args.onOpenAuth} />
</Story>
