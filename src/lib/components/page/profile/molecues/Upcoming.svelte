<script lang="ts">
	import MeetingListItem from '$lib/components/meetings/atoms/MeetingListItem.svelte';
	import { Accordian } from '$lib/components/atoms';
	import type { Dayjs } from 'dayjs';
	import type { ShallowMeeting } from '$lib/gql/types';
	import { entriesById } from '$lib/utils/entries-by-id';

	export let upcomingMeetings: ShallowMeeting[] = [];
	$: groupedEntries = entriesById(upcomingMeetings, {
		getKey: (item) => item.total.beg,
		keyEqual: (lhs: Dayjs, rhs: Dayjs) => lhs.isSame(rhs, 'date'),
	});
</script>

<section>
	<Accordian expanded={true}>
		<h2 slot="title" class="text-xl font-medium">Upcoming meetings</h2>
		<ul class="space-y-4">
			{#each groupedEntries as [date, meetings]}
				<li class="flex space-x-4">
					<div class="py-2 w-[6ch] text-right">
						{date.format('DD MMM')}
					</div>
					<ul class="flex-1 space-y-4">
						{#each meetings as meeting}
							<MeetingListItem {meeting} />
						{/each}
					</ul>
				</li>
			{:else}
				No upcoming meetings...
			{/each}
		</ul>
	</Accordian>
</section>
