<script lang="ts">
	import { Credits, Head } from '$lib/components/atoms';
	import { HomeNewMeetingCard, HomeTitleCard } from '$lib/components/page/home';
	import { name } from './new/_state/meeting';
</script>

<Head />

<div class="max-w-lg p-6 mx-auto space-y-4">
	<HomeTitleCard />
	<HomeNewMeetingCard bind:meetingName={$name} />
	<footer>
		<Credits />
	</footer>
</div>
