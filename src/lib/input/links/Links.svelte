<script lang="ts">
	import { PlusIcon } from 'svelte-feather-icons';
	import { Button } from '$lib/input';
	import type { Maybe } from '$lib/core/types/Maybe';
	import LinkItem, { LinkItemEvent } from './atoms/LinkItem.svelte';

	export let values: string[] = [];
	export let errors: string[] = [];
	let linkItemRefs: Maybe<LinkItem>[] = [];
	export const validate = () => {
		linkItemRefs.forEach((ref) => {
			ref?.validate();
		});
	};

	const handleAddLink = () => {
		values = [...values, ''];
		errors = [...errors, ''];
		linkItemRefs = [...linkItemRefs, undefined];
	};

	const handleRemove = ({ detail }: CustomEvent<LinkItemEvent['remove']>) => {
		const findElement = (_: unknown, index: number) => index !== detail.index;
		values = values.filter(findElement);
		errors = errors.filter(findElement);
		linkItemRefs = linkItemRefs.filter(findElement);
	};
</script>

<ul class="flex flex-col items-start gap-4">
	{#each values as value, index}
		<LinkItem
			bind:this={linkItemRefs[index]}
			{index}
			bind:value
			bind:error={errors[index]}
			on:remove={handleRemove}
		/>
	{/each}
	<Button
		size="sm"
		color="gray"
		class="flex items-center gap-2"
		on:click={handleAddLink}
	>
		<PlusIcon class="wh-5" />
		{#if values.length === 0}
			Add a link
		{:else}
			Add another link
		{/if}
	</Button>
</ul>
