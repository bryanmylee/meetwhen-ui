<script lang="ts">
	import { PlusIcon } from 'svelte-feather-icons';
	import { Button } from '$lib/input';
	import LinkItem, { LinkItemEvent } from './atoms/LinkItem.svelte';

	let links: string[] = [
		'https://smu-sg.zoom.us/j/92480930018?pwd=bzhFUDkrOWQyZm1QTDlYS010TkVrdz09',
	];
	export { links as values };
	export let errors: string[] = [];

	const handleAddLink = () => {
		links = [...links, ''];
		errors = [...errors, ''];
	};

	const handleRemove = ({ detail }: CustomEvent<LinkItemEvent['remove']>) => {
		links = links.filter((_, index) => index !== detail.index);
		errors = errors.filter((_, index) => index !== detail.index);
	};
</script>

<ul class="flex flex-col items-start gap-4">
	{#each links as link, index}
		<LinkItem
			{index}
			bind:link
			error={errors[index]}
			on:remove={handleRemove}
		/>
	{/each}
	<Button
		size="sm"
		color="gray"
		class="flex items-center gap-4"
		on:click={handleAddLink}
	>
		<PlusIcon class="wh-4" />
		Add another link
	</Button>
</ul>
