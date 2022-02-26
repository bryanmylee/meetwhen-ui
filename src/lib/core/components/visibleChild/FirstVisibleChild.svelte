<script lang="ts">
	import { useActions } from '$lib/core/actions';
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import { onDestroy, onMount } from 'svelte';

	let referenceElement: Maybe<HTMLElement>;
	let parentElement: Maybe<HTMLElement>;
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

	onMount(() => {
		parentElement = referenceElement?.parentElement ?? undefined;
		if (parentElement == null) {
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				for (let i = 0; i < entries.length; i++) {
					const entry = entries[i];
					if (entry.isIntersecting && entry.target instanceof HTMLElement) {
						visibleElement = entry.target;
						break;
					}
				}
			},
			{
				threshold: 1,
			},
		);
		const children = parentElement.querySelectorAll(selector);
		const numChildren = children.length;
		for (let i = 0; i < numChildren; i++) {
			const childElement = children.item(i);
			if (childElement == null || !(childElement instanceof HTMLElement)) {
				continue;
			}
			if (visibleElement !== undefined) {
				break;
			}
			observer.observe(childElement);
		}
		console.log(parentElement);
		return () => {
			observer.disconnect();
		};
	});
</script>

<div bind:this={referenceElement} data-visible-reference />
