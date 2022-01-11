export interface GridProps {
	rows?: number;
	cols?: number;
}

export const gridStyle = ({ rows = 1, cols = 1 }: GridProps): string =>
	`display: grid; grid-template: repeat(${rows}, auto) / repeat(${cols}, auto);`;
