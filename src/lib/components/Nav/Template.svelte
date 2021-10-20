<script lang="ts">
	import { media } from '$lib/app-state';
	import { classes } from '$lib/utils/classes';

	export let key: string;

	$: console.log($media.sm);
</script>

<nav
	class={classes([
		'fixed inset-0 bottom-auto z-50 card rounded-t-none transition-shadow duration-300',
		key === '/' && 'shadow-none',
	])}
>
	<div class="flex items-center justify-between mx-auto h-16 max-w-7xl dark:text-white">
		<ul class="flex items-center p-4">
			{#if key !== '/'}
				<slot name="left" />
			{/if}
		</ul>
		{#if $media.sm}
			<ul class="flex items-center p-4 space-x-2">
				<slot name="right" />
			</ul>
		{:else}
			<div class="relative">
				<button>toggle</button>
				<ul class="absolute card top-0 right-0 flex flex-col items-stretch p-4 w-32">
					<slot name="right" />
				</ul>
			</div>
		{/if}
	</div>
</nav>
