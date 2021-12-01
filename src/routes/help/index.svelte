<script lang="ts">
	import Head from '$lib/components/atoms/Head.svelte';
	import Credits from '../../lib/components/atoms/Credits.svelte';
	import Help from './_Help.svelte';
</script>

<Head subtitle="help" emoji="🔬" />

<article class="max-w-lg p-6 pb-4 mx-auto space-y-4">
	<section class="p-4 space-y-2 card">
		<h1 class="text-2xl font-bold">Help</h1>
		<p>Learn how to use <span class="font-bold text-gradient-primary">meetwhen</span>!</p>
	</section>
	<Help />
</article>

<footer class="max-w-lg px-6 pb-4 mx-auto">
	<Credits />
</footer>
