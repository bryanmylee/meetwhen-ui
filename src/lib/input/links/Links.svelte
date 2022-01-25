<script lang="ts">
	import { PlusIcon } from 'svelte-feather-icons';
	import { Button } from '$lib/input';
	import LinkItem, { LinkItemEvent } from './atoms/LinkItem.svelte';

	let links: string[] = [
		'https://smu-sg.zoom.us/j/92480930018?pwd=bzhFUDkrOWQyZm1QTDlYS010TkVrdz09',
	];
	export { links as value };

	const handleAddLink = () => {
		links = [...links, ''];
	};

	const handleRemove = ({ detail }: CustomEvent<LinkItemEvent['remove']>) => {
		links = links.filter((value, index) => index !== detail.index);
	};
</script>

<ul class="flex flex-col items-start gap-4">
	{#each links as link, index}
		<LinkItem {index} bind:link on:remove={handleRemove} />
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
