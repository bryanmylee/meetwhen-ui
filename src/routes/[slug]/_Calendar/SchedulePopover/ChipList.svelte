<script lang="ts">
	export let chips: string[] = [];

	let className = '';
	export { className as class };

	export let isActive = false;
</script>

<ul class="{className} flex flex-wrap gap-2">
	{#each chips as chip}
		<li class="px-2 py-1 rounded-lg {isActive ? 'shade-2' : 'shade'}">
			{chip}
		</li>
	{/each}
</ul>
