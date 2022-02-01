<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ChevronDownIcon } from 'svelte-feather-icons';
	import type { WithErrorable } from '$lib/core/utils/withError';
	import { Button, Textarea, Textfield } from '$lib/input';
	import { focusOnMount } from '$lib/core/utils/useFocusOnMount';
	import { classes } from '$lib/core/utils/classes';

	export let name: WithErrorable<string>;
	export let description: WithErrorable<string>;

	let showDescription = false;
</script>

<div class="name">
	<div class="flex items-center gap-4">
		<Textfield
			slot="title"
			label="Name of your meet"
			bind:value={$name.value}
			error={$name.error}
			required
			use={[[focusOnMount, { delay: 17 }]]}
			class="w-full"
		/>
		<Button
			variant="text-only"
			icon
			aria-expanded={showDescription}
			on:click={() => (showDescription = !showDescription)}
		>
			<ChevronDownIcon
				class={classes(
					'wh-6 transition-transform',
					showDescription && 'rotate-180',
				)}
			/>
		</Button>
	</div>
	{#if showDescription}
		<div transition:slide={{ duration: 300, easing: cubicOut }}>
			<Textarea
				label="Describe your meet?"
				bind:value={$description.value}
				error={$description.error}
				class="w-full mt-4"
			/>
		</div>
	{/if}
</div>

<style lang="postcss">
	.name {
		@apply card p-4;
	}
</style>
