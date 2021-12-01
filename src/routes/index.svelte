<script lang="ts">
	import Credits from '$lib/components/atoms/Credits.svelte';
	import Head from '$lib/components/atoms/Head.svelte';
	import NewMeeting from '$lib/components/page-home/organisms/NewMeeting.svelte';
	import TitleCard from '$lib/components/page-home/TitleCard.svelte';
	import { name } from './new/_state/meeting';
</script>

<Head />

<div class="max-w-lg p-6 mx-auto space-y-4">
	<TitleCard />
	<NewMeeting bind:meetingName={$name} />
	<footer>
		<Credits />
	</footer>
</div>
