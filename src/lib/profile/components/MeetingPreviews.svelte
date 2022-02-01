<script lang="ts">
	import { getColorCssVars, getColorScheme, PRIMARY_HEX } from '$lib/colors';
	import { AccordianCard } from '$lib/core/components/accordian';
	import { dateFromId, dateToId } from '$lib/core/utils/dayjs/dateIds';
	import { groupBy } from '$lib/core/utils/groupBy';
	import type { Meeting } from '$lib/models/Meeting';

	export let title: string;
	export let isLoading: boolean;
	export let meetings: Pick<Meeting, 'name' | 'slug' | 'color' | 'total'>[];
	$: meetingsByStartDateId = groupBy(meetings, (meeting) =>
		dateToId(meeting.total.start),
	);
</script>

<AccordianCard open={true}>
	<h2 slot="title" class="preview-title">{title}</h2>
	<div class="preview-grid">
		{#if isLoading}
			{#each { length: 3 } as _}
				<p class="preview-date-label skeleton">D MMM</p>
				<p class="preview-item-box skeleton">loading...</p>
			{/each}
		{:else}
			{#each Object.entries(meetingsByStartDateId) as [dateId, meetings]}
				{@const dateFmt = dateFromId(dateId).format('D MMM')}
				<label class="preview-date-label" for="meetings-{dateId}">
					{dateFmt}
				</label>
				<ul class="preview-list" id="meetings-{dateId}">
					{#each meetings as { name, slug, color }}
						<li class="preview-item-box">
							<span />
							<a
								href="/{slug}"
								class="preview-item"
								style={getColorCssVars(
									'primary',
									getColorScheme(color ?? PRIMARY_HEX),
								)}
							>
								<p>{name}</p>
							</a>
						</li>
					{/each}
				</ul>
			{/each}
		{/if}
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
		@apply overflow-hidden text-ellipsis;
		&.skeleton {
			@apply skeleton-bg rounded-lg;
		}
	}

	.preview-list {
		@apply flex flex-col gap-4;
	}

	.preview-item-box {
		@apply relative overflow-hidden;
		@apply rounded-lg bg-neutral-100 gdark:bg-neutral-700 focus-within;
		@apply transition;
		&:hover {
			@apply bg-neutral-50 gdark:bg-neutral-600 shadow;
		}
		&:active {
			@apply bg-neutral-200 gdark:opacity-50 shadow-sm;
		}
		&.skeleton {
			@apply skeleton-bg;
		}

		& > span {
			@apply block absolute left-0 top-0 bottom-0 w-2;
			@apply bg-primary-400;
		}
	}

	.preview-item {
		@apply block p-2 ml-2 text-sm font-medium;
	}
</style>
