<script lang="ts">
	import { getIdFromLabel } from '$lib/input/utils/getIdFromLabel';
	import type { Maybe } from '$lib/core/types/Maybe';

	export let label = '';
	export let id: Maybe<string> = undefined;
	$: resolvedId = id ?? getIdFromLabel(label);

	export let value = '';
	export let error = '';

	export let password = false;
	export let required = false;
	export let disabled = false;

	$: attrs = {
		id: resolvedId,
		type: password ? 'password' : 'text',
	};

	let className = '';
	export { className as class };
</script>

<div class="textfield {className}">
	<input
		bind:value
		{...attrs}
		{required}
		{disabled}
		class:filled={value !== ''}
		class:error={error !== ''}
	/>
	<label for={resolvedId}>{label}</label>
	{#if error !== ''}
		<span for={resolvedId}>{error}</span>
	{/if}
</div>
