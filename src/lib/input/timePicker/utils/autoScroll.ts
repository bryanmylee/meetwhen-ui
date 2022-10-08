interface AutoScrollOptions {
	active?: boolean;
	zoneSize?: number;
	speed?: number;
	inset?: {
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
	};
}

interface Zones {
	top?: HTMLElement;
	bottom?: HTMLElement;
	left?: HTMLElement;
	right?: HTMLElement;
}

export function autoScroll(
	node: HTMLElement,
	{
		active = false,
		zoneSize = 30,
		speed = 1,
		inset = {},
	}: AutoScrollOptions = {},
) {
	const zones: Zones = {
		top: document.createElement('div'),
		bottom: document.createElement('div'),
		left: document.createElement('div'),
		right: document.createElement('div'),
	};
	let dx = 0;
	let dy = 0;

	function updateZonePositions() {
		const rect = node.getBoundingClientRect();
		// top zone
		zones.top.style.position = 'fixed';
		zones.top.style.top = 0;
		zones.top.style.left = 0;
		zones.top.style.width = `${window.innerWidth}px`;
		zones.top.style.height = `${rect.top + (inset.top ?? 0) + zoneSize}px`;
		// bottom zone
		zones.bottom.style.position = 'fixed';
		zones.bottom.style.top = `${
			rect.bottom - (inset.bottom ?? 0) - zoneSize
		}px`;
		zones.bottom.style.left = 0;
		zones.bottom.style.width = `${window.innerWidth}px`;
		zones.bottom.style.height = `${
			zoneSize + window.innerHeight - rect.bottom
		}px`;
		// left zone
		zones.left.style.position = 'fixed';
		zones.left.style.top = 0;
		zones.left.style.left = 0;
		zones.left.style.width = `${rect.left + (inset.left ?? 0) + zoneSize}px`;
		zones.left.style.height = `${window.innerHeight}px`;
		// right zone
		zones.right.style.position = 'fixed';
		zones.right.style.top = 0;
		zones.right.style.left = `${rect.right - (inset.right ?? 0) - zoneSize}px`;
		zones.right.style.width = `${zoneSize + window.innerWidth - rect.right}px`;
		zones.right.style.height = `${window.innerHeight}px`;
	}

	const handleMouseEnter = ({ currentTarget }: MouseEvent) => {
		if (currentTarget === zones.top) {
			dy = -speed;
		} else if (currentTarget === zones.bottom) {
			dy = speed;
		} else if (currentTarget === zones.left) {
			dx = -speed;
		} else {
			dx = speed;
		}
	};

	const handleMouseLeave = ({ currentTarget }: MouseEvent) => {
		if (currentTarget === zones.top || currentTarget === zones.bottom) {
			dy = 0;
		} else {
			dx = 0;
		}
	};

	Object.values(zones).forEach((zone) => {
		zone.addEventListener('mouseenter', handleMouseEnter);
		zone.addEventListener('mouseleave', handleMouseLeave);
	});

	let prevTime = 0;
	function triggerScroll(time?: number) {
		if (!active) return;
		if (dx !== 0 || dy !== 0) {
			const delta = time === undefined ? 16 : time - prevTime;
			node.scrollLeft += delta * dx;
			node.scrollTop += delta * dy;
		}
		requestAnimationFrame(triggerScroll);
		prevTime = time;
	}
	triggerScroll();

	function activate() {
		updateZonePositions();
		triggerScroll();
		Object.values(zones).forEach((zone) => document.body.appendChild(zone));
	}
	function deactivate() {
		dx = 0;
		dy = 0;
		Object.values(zones).forEach((zone) => document.body.removeChild(zone));
	}
	return {
		update(props: AutoScrollOptions) {
			active = props.active;
			if (props.active) {
				activate();
			} else {
				deactivate();
			}
		},
		destroy() {
			Object.values(zones).forEach((zone) => {
				zone.removeEventListener('mouseenter', handleMouseEnter);
				zone.removeEventListener('mouseleave', handleMouseLeave);
			});
		},
	};
}
