<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
</script>

<Meta
	title="Input/Button"
	component={Button}
	argTypes={{
		onClick: { action: 'onClick' },
		onDoubleClick: { action: 'onDoubleClick' },
		onContextMenu: { action: 'onContextMenu' },
		onFocus: { action: 'onFocus' },
		onBlur: { action: 'onBlur' },
	}}
/>

<Template let:args>
	<Button
		{...args}
		on:click={args.onClick}
		on:dblclick={args.onDoubleClick}
		on:contextmenu={args.onContextMenu}
		on:focus={args.onFocus}
		on:blur={args.onBlur}
	>
		Custom
	</Button>
</Template>

<Story name="Gallery">
	<div class="flex flex-col items-center gap-4">
		<Button>Primary</Button>
		<Button disabled>Disabled</Button>
		<Button variant="outlined">Outline</Button>
		<Button variant="outlined" disabled>Disabled Outline</Button>
	</div>
</Story>

<Story name="Custom" source />
