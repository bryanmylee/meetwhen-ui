<script lang="ts" context="module">
	export interface LongTouch {
		touch: Touch;
		initClientX: number;
		initClientY: number;
		pending: boolean;
		active: boolean;
		timeoutId: number;
	}

	export interface LongTouchEvent {
		touchstart: {
			event: TouchEvent;
		};
		touchmove: {
			event: TouchEvent;
		};
		touchend: {
			event: TouchEvent;
		};
		longtouchstart: {
			event: TouchEvent;
		};
		longtouchmove: {
			event: TouchEvent;
		};
		longtouchend: {
			event: TouchEvent;
		};
	}
</script>

<script lang="ts">
	import LongTouchIndicator from './LongTouchIndicator.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getTouchArray } from './getTouchArray';

	const dispatch = createEventDispatcher<LongTouchEvent>();

	export let disabled = false;
	export let startDelay = 300;
	export let deviateLimit = 5;

	let tracked: Record<number, LongTouch> = {};

	const touchstart = (event: TouchEvent) => {
		if (disabled) {
			return;
		}
		disableSelect();
		dispatch('touchstart', { event });
		const changedTouches = getTouchArray(event.changedTouches);
		changedTouches.forEach((touch) => track(touch, event));
	};

	const track = (touch: Touch, event: TouchEvent) => {
		indicateLongTouch(touch);
		tracked[touch.identifier] = {
			touch,
			initClientX: touch.clientX,
			initClientY: touch.clientY,
			pending: true,
			active: false,
			timeoutId: window.setTimeout(() => {
				const longTouch = tracked[touch.identifier];
				if (longTouch.pending) {
					longTouch.pending = false;
					longTouch.active = true;
					dispatch('longtouchstart', { event });
				}
			}, startDelay),
		};
	};

	const touchmove = (event: TouchEvent) => {
		dispatch('touchmove', { event });
		const changedTouches = getTouchArray(event.changedTouches);
		changedTouches.forEach((touch) => updateMovement(touch, event));
	};

	const getSquareDistance = (
		x1: number,
		x2: number,
		y1: number,
		y2: number,
	) => {
		return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
	};

	const updateMovement = (touch: Touch, event: TouchEvent) => {
		const { identifier } = touch;
		const longTouch = tracked[identifier];
		if (longTouch == null) {
			removeIndicator();
			return;
		}
		const { initClientX: x1, initClientY: y1 } = longTouch;
		const { clientX: x2, clientY: y2 } = touch;
		if (longTouch.active) {
			dispatch('longtouchmove', { event });
			return;
		}
		if (
			getSquareDistance(x1, x2, y1, y2) > Math.pow(deviateLimit, 2) &&
			longTouch.pending
		) {
			longTouch.pending = false;
			untrack(touch, event);
		}
	};

	const touchend = (event: TouchEvent) => {
		enableSelect();
		const changedTouches = getTouchArray(event.changedTouches);
		changedTouches.forEach((touch) => untrack(touch, event));
		removeIndicator();
		dispatch('touchend', { event });
	};

	const untrack = (touch: Touch, event: TouchEvent) => {
		const { identifier } = touch;
		const longTouch = tracked[identifier];
		if (longTouch == null) {
			return;
		}
		if (longTouch.active) {
			dispatch('longtouchend', { event });
		}
		clearTimeout(longTouch.timeoutId);
		delete tracked[identifier];
	};

	const disableSelect = () => {
		if (typeof document === 'undefined') {
			return;
		}
		document.documentElement.classList.add('select-none');
	};

	const enableSelect = () => {
		if (typeof document === 'undefined') {
			return;
		}
		document.documentElement.classList.remove('select-none');
	};

	let appRootElement: HTMLElement;
	let indicator: LongTouchIndicator;
	onMount(() => {
		appRootElement =
			document.querySelector('#root') ?? (document.body as HTMLBodyElement);
	});

	const indicateLongTouch = (touch: Touch) => {
		indicator?.$destroy();
		indicator = new LongTouchIndicator({
			target: appRootElement,
			props: { x: touch.clientX, y: touch.clientY, triggerDelay: startDelay },
		});
		setTimeout(() => {
			removeIndicator();
		}, startDelay + indicator.triggerDuration + indicator.outroDuration);
	};

	const removeIndicator = () => {
		indicator?.$destroy();
	};
</script>

<div
	on:touchstart={touchstart}
	on:touchmove={touchmove}
	on:touchcancel
	on:touchend={touchend}
	class="contents"
>
	<slot />
</div>
