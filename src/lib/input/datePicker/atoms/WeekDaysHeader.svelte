<script lang="ts">
	import type { Dayjs } from 'dayjs';

	export let weekDays: Dayjs[];
</script>

<div role="grid" class="grid grid-cols-7">
	{#each weekDays as day}
		<div
			role="columnheader"
			aria-label={day.format('dddd')}
			class="px-2 py-4 text-label text-center"
		>
			{day.format('ddd')}
		</div>
	{/each}
</div>
