export type Action<Props = undefined> = (
	node: HTMLElement,
	props: Props,
) => {
	update?: (newProps: Props) => void;
	destroy?: () => void;
} | void;

export type NoPropAction = (node: HTMLElement) => {
	destroy?: () => void;
} | void;
