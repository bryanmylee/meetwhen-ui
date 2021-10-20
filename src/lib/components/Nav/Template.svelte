<script lang="ts">
	import { receive, send } from '$lib/app-state';
	import { classes } from '$lib/utils/classes';

	export let key: string;
</script>

<nav
	class={classes([
		'fixed inset-0 bottom-auto z-50 card rounded-t-none transition-shadow duration-300',
		key === '/' && 'shadow-none',
	])}
>
	<div class="flex items-center justify-between mx-auto h-16 max-w-7xl dark:text-white">
		<ul class="flex items-center p-4 space-x-3">
			{#if key !== '/'}
				<slot name="left" />
			{/if}
		</ul>
		<ul class="flex items-center p-4 divide-x divide-gray-400">
			<slot name="right" />
		</ul>
	</div>
</nav>
