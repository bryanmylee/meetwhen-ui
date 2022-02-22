import type {
	ActionArray,
	SvelteActionReturnType,
} from '@rgossiaux/svelte-headlessui/hooks/use-actions';

export const useActions = (
	node: HTMLElement | SVGElement,
	actions: ActionArray,
): SvelteActionReturnType<ActionArray> => {
	const actionReturns =
		actions?.map((actionEntry) => {
			const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
			const actionProps = Array.isArray(actionEntry)
				? actionEntry[1]
				: undefined;
			return action(node as HTMLElement & SVGElement, actionProps);
		}) ?? [];

	return {
		update(actions?: ActionArray) {
			if (actions !== undefined && actions.length !== actionReturns.length) {
				throw new Error('You must not change the length of an actions array.');
			}
			if (actions !== undefined) {
				for (let i = 0; i < actions.length; i++) {
					const returnEntry = actionReturns[i];
					if (returnEntry?.update !== undefined) {
						const actionEntry = actions[i];
						if (Array.isArray(actionEntry)) {
							returnEntry.update(actionEntry[1]);
						} else {
							returnEntry.update();
						}
					}
				}
			}
		},
		destroy() {
			actionReturns.forEach((returnEntry) => {
				if (returnEntry?.destroy !== undefined) {
					returnEntry.destroy();
				}
			});
		},
	};
};
