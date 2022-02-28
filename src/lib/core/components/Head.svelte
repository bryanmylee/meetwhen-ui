<script lang="ts">
	export let emoji: Maybe<string> = undefined;
	export let subtitle: Maybe<string> = undefined;
	export let description: Maybe<string> = undefined;
	export let noRobots = false;
</script>

<svelte:head>
	<title>
		{subtitle ?? ''}
		{emoji ?? subtitle === undefined ? '' : '•'}
		meetwhen.io
	</title>
	<meta
		name="description"
		content={description ?? 'Find the perfect time together'}
	/>
	{#if noRobots}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>
