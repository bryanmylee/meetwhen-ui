<script lang="ts">
	export let emoji: Maybe<string> = undefined;
	export let subtitle: Maybe<string> = undefined;
	export let description: Maybe<string> = 'Find the perfect time together';
	export let noRobots = false;

	$: title =
		emoji !== undefined || subtitle !== undefined
			? `meetwhen.io ${emoji ?? '•'} ${subtitle}`
			: 'meetwhen.io';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if noRobots}
		<meta name="robots" content="noindex" />
	{/if}

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://meetwhen.io/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="/meta-image.jpg" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="meetwhen.io" />
	<meta property="twitter:url" content="https://meetwhen.io/" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="/meta-image.jpg" />
</svelte:head>
