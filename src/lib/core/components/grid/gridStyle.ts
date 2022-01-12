export interface GridProps {
	rows?: number;
	cols?: number;
	headerRow?: boolean;
	indexCol?: boolean;
}

export const gridStyle = ({
	rows = 1,
	cols = 1,
	headerRow = false,
	indexCol = false,
}: GridProps): string =>
	`display: grid; grid-template: ${
		headerRow ? 'min-content' : ''
	} repeat(${rows}, auto) / ${
		indexCol ? 'min-content' : ''
	} repeat(${cols}, auto);`;
