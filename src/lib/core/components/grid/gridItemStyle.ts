export interface GridItemProps {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
}

export const gridItemStyle = ({
	x = 0,
	y = 0,
	width = 1,
	height = 1,
}: GridItemProps): string =>
	`grid-area: ${y + 1} / ${x + 1} / ${y + 1 + height} / ${x + 1 + width};`;
