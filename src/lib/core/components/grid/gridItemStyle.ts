export interface GridItemProps {
	x?: number;
	y?: number;
	endX?: number;
	endY?: number;
}

export const gridItemStyle = ({
	x = 0,
	y = 0,
	endX = x + 1,
	endY = y + 1,
}: GridItemProps): string =>
	`grid-area: ${y + 1} / ${x + 1} / ${endY + 1} / ${endX + 1};`;
