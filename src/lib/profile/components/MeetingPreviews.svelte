<script lang="ts" context="module">
	export type MeetingFields = Pick<
		Meeting,
		'name' | 'slug' | 'color' | 'total'
	>;
</script>

<script lang="ts">
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	import { AccordianCard } from '$lib/core/components/accordian';
	import { dateFromId, dateToId } from '$lib/core/utils/dayjs/dateIds';
	import { groupBy } from '$lib/core/utils/groupBy';
	import type { Paginated } from '$lib/firebase/queries/paginated';
	import type { Meeting } from '$lib/models/Meeting';
	import { Button } from '$lib/input';
	import MeetingPreview from './MeetingPreview.svelte';

	export let title: string;
	export let meetingsPage: Paginated<Id<MeetingFields>>;
	$: meetings = $meetingsPage.isLoading ? [] : $meetingsPage.data;
	$: meetingsByStartDateId = groupBy(meetings, (meeting) =>
		dateToId(meeting.total.start),
	);

	export let open = false;
</script>

<AccordianCard {open}>
	<h2 slot="title" class="preview-title">{title}</h2>
	<div class="preview-grid">
		{#if $meetingsPage.isLoading}
			{#each { length: 5 } as _}
				<p class="preview-date-label skeleton">D MMM</p>
				<ul>
					<li><MeetingPreview isLoading name="loading" slug="loading" /></li>
				</ul>
			{/each}
		{:else}
			{#each Object.entries(meetingsByStartDateId) as [dateId, meetings]}
				{@const dateFmt = dateFromId(dateId).format('D MMM')}
				<label class="preview-date-label" for="meetings-{dateId}">
					{dateFmt}
				</label>
				<ul class="preview-date-list" id="meetings-{dateId}">
					{#each meetings as { name, slug, color }}
						<li><MeetingPreview {name} {slug} {color} /></li>
					{/each}
				</ul>
			{:else}
				<h3 class="text-sm col-span-2">Nothing here...</h3>
			{/each}
		{/if}
	</div>
	<div class="paging-button-box">
		<Button
			icon
			variant="text-only"
			disabled={$meetingsPage.index === 0}
			on:click={() => meetingsPage.previousPage()}
		>
			<ChevronLeftIcon class="wh-6" />
		</Button>
		<span class="text-label">{$meetingsPage.index + 1}</span>
		<Button
			icon
			variant="text-only"
			disabled={$meetingsPage.isLoading || $meetingsPage.isLast}
			on:click={() => meetingsPage.nextPage()}
		>
			<ChevronRightIcon class="wh-6" />
		</Button>
	</div>
</AccordianCard>

<style lang="postcss">
	.preview-title {
		@apply w-fit mr-auto text-title-3;
	}

	.preview-grid {
		@apply grid gap-4;
		grid-template-columns: 6ch 1fr;
	}

	.preview-date-label {
		@apply text-label p-2 pr-0;
		@apply overflow-hidden text-ellipsis whitespace-nowrap;
		&.skeleton {
			@apply skeleton-bg rounded-lg;
		}
	}

	.preview-date-list {
		@apply flex flex-col gap-4;
	}
	.paging-button-box {
		@apply flex items-center gap-4 mt-4;
	}
</style>
