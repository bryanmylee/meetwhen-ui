<script lang="ts">
	import Textfield from '$lib/components/Textfield.svelte';
	import { getLoadingContext } from './index';

	export let id: string = undefined;
	export let password = false;

	export let value = '';
	export let placeholder = '';
	export let error = '';

	export let required = false;
	export let disabled = false;
	export let touched = false;
	export let focusOnMount = false;

	let className = '';
	export { className as class };

	const isLoading = getLoadingContext();
	$: resolvedDisabled = $isLoading || disabled;
</script>

<Textfield
	bind:value
	{id}
	{password}
	{placeholder}
	{error}
	{required}
	disabled={resolvedDisabled}
	{touched}
	{focusOnMount}
	class={className}
/>
