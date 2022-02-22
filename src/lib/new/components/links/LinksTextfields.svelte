<script lang="ts" context="module">
	export interface LinkItemData {
		uuid: number;
		value: string;
		error: string;
		ref: Maybe<LinkTextfield>;
	}
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { PlusIcon } from 'svelte-feather-icons';
	import { Button } from '$lib/input';
	import LinkTextfield, {
		LinkTextfieldEvent,
	} from './atoms/LinkTextfield.svelte';

	let items: LinkItemData[] = [];
	export let values: string[] = [];
	$: values = items.map((i) => i.value);
	export let errors: string[] = [];
	$: errors = items.map((i) => i.error).filter((e) => e !== '');
	let linkItemRefs: Maybe<LinkTextfield>[] = [];
	$: linkItemRefs = items.map((i) => i.ref);

	export const validate = () => {
		linkItemRefs.forEach((ref) => {
			ref?.validate();
		});
	};

	let uuid = 0;
	const handleAddLink = () => {
		items = [...items, { uuid: uuid++, value: '', error: '', ref: undefined }];
	};

	const handleRemove = ({
		detail,
	}: CustomEvent<LinkTextfieldEvent['remove']>) => {
		items = items.filter((_, index) => index !== detail.index);
	};
</script>

<div class="flex flex-col items-start">
	<ul
		class="links-list"
		class:mb-4={items.length > 0}
		style:--numRows={items.length}
	>
		{#each items as { uuid, value, error, ref }, index (uuid)}
			<div
				in:fade|local={{ duration: 300, delay: 150, easing: cubicOut }}
				out:fade|local={{ duration: 300, easing: cubicOut }}
				class="links-list-item"
				style:--index={index}
			>
				<LinkTextfield
					bind:this={ref}
					{index}
					bind:value
					bind:error
					on:remove={handleRemove}
				/>
			</div>
		{/each}
	</ul>
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
</div>

<style lang="postcss">
	.links-list {
		@apply relative w-full flex flex-col gap-4;
		/* 2.5rem for each row and 1rem for padding in between. */
		height: calc(2.5rem + (var(--numRows) - 1) * 3.5rem);
		transition: height 300ms var(--cubicOut);
	}

	.links-list-item {
		@apply w-full;
		@apply absolute left-0 right-0;
		/* 2.5rem + 1rem for each row and padding above */
		top: calc(var(--index) * 3.5rem);
		transition: top 300ms var(--cubicOut);
	}
</style>
