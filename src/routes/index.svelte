<script lang="ts">
	import { Credits, Head } from '$lib/components/atoms';
	import NewMeeting from '$lib/components/page/home/organisms/NewMeeting.svelte';
	import TitleCard from '$lib/components/page/home/organisms/TitleCard.svelte';
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
