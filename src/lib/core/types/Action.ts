export type Action<Params = undefined> = (
	node: HTMLElement,
	params: Params,
) => {
	update?: (newParams: Params) => void;
	destroy?: () => void;
} | void;

export type NoParamAction = (node: HTMLElement) => {
	destroy?: () => void;
} | void;
