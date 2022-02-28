<script lang="ts">
	import { setLoading } from '$lib/loading';

	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import { writable } from 'svelte/store';
	import Button from './Button.svelte';
	import LoadingButton from './LoadingButton.svelte';

	const isLoading = writable(true);

	setLoading(isLoading);
</script>

<Meta
	title="Input/Loading/Button"
	component={LoadingButton}
	argTypes={{
		type: {
			control: { type: 'select' },
			options: ['button', 'menu', 'reset', 'submit'],
		},
		variant: {
			control: { type: 'select' },
			options: ['filled', 'outlined', 'text-only'],
		},
		color: {
			control: { type: 'select' },
			options: ['primary', 'gray'],
		},
		size: {
			control: { type: 'select' },
			options: ['lg', 'sm'],
		},
		onClick: { action: 'onClick' },
		onDoubleClick: { action: 'onDoubleClick' },
		onContextMenu: { action: 'onContextMenu' },
		onFocus: { action: 'onFocus' },
		onBlur: { action: 'onBlur' },
	}}
/>

<Template let:args>
	<LoadingButton
		{...args}
		on:click={args.onClick}
		on:dblclick={args.onDoubleClick}
		on:contextmenu={args.onContextMenu}
		on:focus={args.onFocus}
		on:blur={args.onBlur}
	>
		Custom
	</LoadingButton>
</Template>

<Story name="Loading button variants">
	<Button on:click={() => ($isLoading = !$isLoading)}>Toggle loading</Button>
	<div class="flex gap-4 mt-4">
		<div class="flex flex-col items-start gap-4">
			<LoadingButton>Primary Filled</LoadingButton>
			<LoadingButton disabled>Primary Filled Disabled</LoadingButton>
			<LoadingButton color="gradient">Primary Gradient</LoadingButton>
			<LoadingButton variant="outlined">Primary Outline</LoadingButton>
			<LoadingButton variant="outlined" disabled>
				Primary Disabled Outline
			</LoadingButton>
		</div>
		<div class="flex flex-col items-start gap-4">
			<LoadingButton color="gray">Gray Filled</LoadingButton>
			<LoadingButton color="gray" disabled>Gray Filled Disabled</LoadingButton>
			<LoadingButton color="gray" variant="outlined">Gray Outline</LoadingButton
			>
			<LoadingButton color="gray" variant="outlined" disabled>
				Gray Disabled Outline
			</LoadingButton>
		</div>
		<div class="flex flex-col items-start gap-4">
			<LoadingButton variant="text-only">Text-only</LoadingButton>
			<LoadingButton variant="text-only" disabled>
				Text-only Disabled
			</LoadingButton>
		</div>
	</div>
</Story>
