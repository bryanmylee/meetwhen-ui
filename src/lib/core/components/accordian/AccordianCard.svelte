<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
	} from '@rgossiaux/svelte-headlessui';
	import { ChevronDownIcon } from 'svelte-feather-icons';
	import { classes } from '$lib/core/utils/classes';

	let className = '';
	export { className as class };
</script>

<Disclosure class="accordian-card {className}" let:open>
	<DisclosureButton class="accordian-title">
		<div class="contents">
			<slot name="title">
				<div />
			</slot>
		</div>
		<ChevronDownIcon
			class={classes('wh-6 transition-transform', open && 'rotate-180')}
		/>
	</DisclosureButton>
	<DisclosurePanel class="w-full">
		<div
			transition:slide|local={{ duration: 300, easing: cubicOut }}
			class="accordian-panel"
		>
			<slot />
		</div>
	</DisclosurePanel>
</Disclosure>

<style lang="postcss" global>
	.accordian-card {
		@apply card rounded-xl;
		& .accordian-title {
			@apply p-4 rounded-xl focus-inset;
		}
		& .accordian-panel {
			@apply p-4 pt-1;
		}
	}

	.accordian-title {
		@apply w-full;
		@apply flex items-center gap-4;
		@apply text-left;
	}

	.accordian-panel {
		@apply w-full;
	}
</style>
