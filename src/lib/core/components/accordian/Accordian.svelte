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

<Disclosure class="accordian {className}" let:open>
	<DisclosureButton class="accordian-title">
		<div on:click|stopPropagation class="contents">
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

<style lang="postcss">
	:global(.accordian) {
		@apply card rounded-xl;
	}
	:global(.accordian-title) {
		@apply p-4 rounded-xl focus-inset w-full;
		@apply flex items-center gap-4;
		@apply text-left;
	}

	:global(.accordian-panel) {
		@apply w-full p-4 pt-1;
	}
</style>
