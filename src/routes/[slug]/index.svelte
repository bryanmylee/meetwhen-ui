<script lang="ts" context="module">
	export const load: Load<{ session: Session }> = async ({ params }) => {
		const { slug } = params;
		const meeting = await findMeetingWithSlug(firebaseClient.repo, slug);
		return {
			props: {
				meeting,
			},
		};
	};
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { ShareIcon } from 'svelte-feather-icons';
	import type { Session } from '$lib/core/types/Session';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { Meeting, MeetingData } from '$lib/models/Meeting';
	import type { Id } from '$lib/core/types/Id';
	import { firebaseClient } from '$lib/firebase/client';
	import { useRepo } from '$lib/firebase/context';
	import { useLiveDocument } from '$lib/firebase/utils/useLiveDocument';
	import { findMeetingWithSlug } from '$lib/firebase/queries/meetings';
	import { Button } from '$lib/input';
	import { ShareDialog } from '$lib/meeting/components';

	const repo = useRepo();

	export let meeting: Id<Meeting>;
	const liveMeetingDocument = useLiveDocument<MeetingData>(
		repo,
		'meetings',
		meeting.id,
	);
	$: {
		const data = $liveMeetingDocument?.data();
		if (data !== undefined)
			meeting = {
				id: meeting.id,
				...MeetingConverter.parse(data),
			};
	}
	$: console.log(meeting);

	let showShareDialog = false;
</script>

<section>
	<div class="max-w-xl p-4 mx-auto flex flex-col gap-4">
		<div class="meeting-desc-box">
			<span />
			<div class="meeting-desc">
				<h1 class="text-headline">{meeting.name}</h1>
			</div>
			<Button
				icon
				variant="text-only"
				on:click={() => (showShareDialog = true)}
			>
				<ShareIcon class="wh-4" />
			</Button>
		</div>
	</div>
</section>
<ShareDialog bind:open={showShareDialog} slug={meeting.slug} />

<style lang="postcss">
	.meeting-desc-box {
		@apply relative p-4 card;
		@apply flex justify-between items-start;

		& > span {
			@apply block absolute left-0 top-0 bottom-0 w-3 rounded-l-xl;
			@apply overflow-hidden text-ellipsis;
			@apply bg-gradient-to-tr from-primary-400-2 via-primary-400 to-primary-400+1;
		}
	}

	.meeting-desc {
		@apply block ml-3;
	}
</style>
