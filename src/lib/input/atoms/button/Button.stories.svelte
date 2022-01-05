<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
</script>

<Meta
	title="Input/Button"
	component={Button}
	argTypes={{
		type: {
			control: { type: 'select' },
			options: ['button', 'menu', 'reset', 'submit'],
		},
		variant: {
			control: { type: 'select' },
			options: ['filled', 'outlined'],
		},
		color: {
			control: { type: 'select' },
			options: ['primary', 'gray'],
		},
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
	<h1 class="text-xl font-bold">Text Buttons</h1>
	<div class="flex gap-4 mt-4">
		<div class="flex flex-col items-start gap-4">
			<Button>Primary Filled</Button>
			<Button disabled>Primary Filled Disabled</Button>
			<Button variant="outlined">Primary Outline</Button>
			<Button variant="outlined" disabled>Primary Disabled Outline</Button>
		</div>
		<div class="flex flex-col items-start gap-4">
			<Button color="gray">Gray Filled</Button>
			<Button color="gray" disabled>Gray Filled Disabled</Button>
			<Button color="gray" variant="outlined">Gray Outline</Button>
			<Button color="gray" variant="outlined" disabled
				>Gray Disabled Outline</Button
			>
		</div>
	</div>
</Story>

<Story name="Custom" source />
