<script lang="ts">
	import type { Dayjs } from 'dayjs';

	export let weekDays: Dayjs[];
</script>

<div role="grid" class="grid grid-cols-7">
	{#each weekDays as day}
		<div
			role="columnheader"
			aria-label={day.format('dddd')}
			class="p-2 text-center"
		>
			{day.format('ddd')}
		</div>
	{/each}
</div>
