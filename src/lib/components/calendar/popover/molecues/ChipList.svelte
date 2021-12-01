<script lang="ts">
	import Chip from '../atoms/Chip.svelte';

	export let chips: string[] = [];

	let className = '';
	export { className as class };

	export let isActive = false;
</script>

<ul class="{className} flex flex-wrap gap-2">
	{#each chips as chip}
		<Chip {isActive}>
			{chip}
		</Chip>
	{/each}
</ul>
