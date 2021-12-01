<script lang="ts">
	import Head from '$lib/components/atoms/Head.svelte';
	import Credits from '$lib/components/atoms/Credits.svelte';
	import Header from './_Header.svelte';
	import NewMeeting from './_NewMeeting.svelte';
</script>

<Head />

<div class="max-w-lg p-6 mx-auto space-y-4">
	<Header />
	<NewMeeting />
	<footer>
		<Credits />
	</footer>
</div>
