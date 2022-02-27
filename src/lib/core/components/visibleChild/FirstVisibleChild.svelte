<script lang="ts">
	import { useActions } from '$lib/core/actions';
	import type { HTMLActionArray } from '@rgossiaux/svelte-headlessui/hooks/use-actions';
	import { onDestroy, onMount } from 'svelte';

	let referenceElement: Maybe<HTMLElement>;
	let parentElement: Maybe<HTMLElement>;
	let visibleElement: Maybe<HTMLElement>;

	export let selector: string;
	export let root: Maybe<HTMLElement> = undefined;
	export let rootMargin: Maybe<string> = undefined;

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

	let visibleElements: Set<HTMLElement> = new Set();
	const observe = () => {
		parentElement = referenceElement?.parentElement ?? undefined;
		if (parentElement == null) {
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				for (let i = 0; i < entries.length; i++) {
					const entry = entries[i];
					if (!(entry.target instanceof HTMLElement)) {
						continue;
					}
					if (entry.isIntersecting) {
						visibleElements.add(entry.target);
					} else {
						visibleElements.delete(entry.target);
					}
				}
				if (visibleElements.size > 0) {
					visibleElement = visibleElements.values().next().value;
				}
			},
			{
				threshold: 1,
				root,
				rootMargin,
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
		return () => {
			observer.disconnect();
		};
	};

	let unobserve: Maybe<() => void>;
	onMount(() => {
		unobserve = observe();
		return unobserve;
	});
	$: if (root !== undefined) {
		unobserve?.();
		unobserve = observe();
	}
</script>

<div bind:this={referenceElement} data-visible-reference />
