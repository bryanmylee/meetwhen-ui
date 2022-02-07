<script lang="ts">
	import { createPopperActions } from 'svelte-popperjs';
	import type { UserIdsInterval } from '$lib/core/types/UserIdsInterval';
	import UserList from './UserList.svelte';
	import { getUsersCache } from '$lib/meeting/utils/usersCacheContext';

	export let interval: UserIdsInterval;
	const usersCache = getUsersCache();
	$: maxUserCount = Object.keys($usersCache).length;
	$: users = interval.userIds
		.map((uid) => $usersCache[uid])
		.filter((u) => u !== undefined)
		.toArray();
	$: unavailableUsers = Object.entries($usersCache)
		.filter(([id]) => !interval.userIds.includes(id))
		.map(([, user]) => user);

	const INDEX_COL_WIDTH = 52;
	const HEADER_HEIGHT = 36;
	const [ref, content, getInstance] = createPopperActions({
		strategy: 'absolute',
		placement: 'right',
		modifiers: [
			{ name: 'arrow', options: { padding: 16 } },
			{ name: 'eventListeners', options: { scroll: false, resize: false } },
			{ name: 'offset', options: { offset: [0, 12] } },
			{
				name: 'preventOverflow',
				options: {
					altAxis: true,
					padding: {
						top: HEADER_HEIGHT + 4,
						bottom: 4,
						right: 4,
						left: INDEX_COL_WIDTH + 4,
					},
				},
			},
		],
	});

	export let show = false;
	export let isActive = false;

	export let referenceElement: HTMLElement;
	$: if (referenceElement !== undefined) {
		ref(referenceElement);
	}

	export const updateRefPosition = (event: MouseEvent): void => {
		const parent = event.target as HTMLDivElement | null;
		if (parent === null) {
			return;
		}
		const parentRect = parent.getBoundingClientRect();
		const top = Math.max(0, event.clientY - parentRect.top);
		referenceElement.style.position = 'absolute';
		referenceElement.style.left = '0';
		referenceElement.style.top = `${top}px`;
		updatePopoverPosition();
	};

	export const updatePopoverPosition = (): void => {
		getInstance()?.update();
	};
</script>

{#if show}
	<div use:content class="popover" class:active={isActive}>
		<div data-popper-arrow>
			<div class="popover-arrow" class:active={isActive} />
		</div>
		<div class="popover-content">
			<h1 class="py-3 text-label">
				{interval.start.format('h:mma')} – {interval.end.format('h:mma')}
			</h1>
			<div class="py-3 border-t border-neutral-200 dark:border-neutral-700">
				<UserList {users} {maxUserCount} />
			</div>
			{#if unavailableUsers.length > 0}
				<div class="py-3 border-t border-neutral-200 dark:border-neutral-700">
					<UserList unavailable users={unavailableUsers} {maxUserCount} />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.popover {
		@apply card border-3 w-max max-w-96;
		@apply pointer-events-none;
		&.active {
			@apply pointer-events-auto;
			@apply border-primary-400 gdark:border-primary-300 z-20;
		}
		&:not(.active) {
			@apply border-neutral-400 z-30;
		}
	}

	.popover-arrow {
		@apply wh-4 bg-white gdark:bg-neutral-800 rotate-45;
		&.active {
			@apply border-primary-400 gdark:border-primary-300;
		}
		&:not(.active) {
			@apply border-neutral-400;
		}
	}

	.popover:global([data-popper-placement^='right']) {
		& [data-popper-arrow] {
			@apply left-0;
		}
		& .popover-arrow {
			@apply border-l-3 border-b-3;
			--tw-translate-x: calc(-50% - 2px);
		}
	}

	.popover:global([data-popper-placement^='left']) {
		& [data-popper-arrow] {
			@apply right-0;
		}
		& .popover-arrow {
			@apply border-r-3 border-t-3;
			--tw-translate-x: calc(50% + 2px);
		}
	}

	.popover-content {
		@apply px-3;
	}
</style>
