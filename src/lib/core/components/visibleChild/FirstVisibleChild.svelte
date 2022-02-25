<script lang="ts">
	import { useActions } from '$lib/core/actions';
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import { onDestroy } from 'svelte';

	let referenceElement: Maybe<HTMLElement>;
	let visibleElement: Maybe<HTMLElement>;

	export let selector: string;

	export let use: HTMLActionArray = [];
	let useUpdate: Maybe<(actions?: HTMLActionArray) => void>;
	let useDestroy: Maybe<() => void>;
	$: if (visibleElement !== undefined) {
		useDestroy?.();
		const actionReturn = useActions(visibleElement, use);
		if (actionReturn !== undefined) {
			useUpdate = actionReturn.update;
			useDestroy = actionReturn.destroy;
		}
	}
	$: use, callUseUpdate();
	const callUseUpdate = () => {
		useUpdate?.(use);
	};
	onDestroy(() => {
		useDestroy?.();
	});

	export const update = () => {
		const parentElement = referenceElement?.parentElement;
		if (parentElement == null) {
			return;
		}
		const parentRect = parentElement.getBoundingClientRect();
		const children = parentElement.querySelectorAll(selector);
		const numChildren = children.length;
		for (let i = 0; i < numChildren; i++) {
			const childElement = children.item(i);
			if (childElement == null || !(childElement instanceof HTMLElement)) {
				continue;
			}
			const childRect = childElement.getBoundingClientRect();
			console.log({ parentElement, parentRect });
			console.log({ childElement, childRect });
			if (
				childRect.left >= parentRect.left &&
				childRect.right <= parentRect.right &&
				childRect.top >= parentRect.top &&
				childRect.bottom <= parentRect.bottom
			) {
				visibleElement = childElement;
				break;
			}
		}
	};
</script>

<div bind:this={referenceElement} data-visible-reference />
