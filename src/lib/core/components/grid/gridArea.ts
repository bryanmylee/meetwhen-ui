export interface GridAreaProps {
	x?: number;
	y?: number;
	endX?: number;
	endY?: number;
}

/**
 * Simplify the positioning of grid items in a CSS grid by generating the
 * appropriate value for the `grid-area` CSS property value.
 * @param props.x The starting x position of the item.
 * @param props.y The starting y position of the item.
 * @param props.endX The ending x position of the item non-inclusive.
 * @param props.endY The ending y position of the item non-inclusive.
 * @returns The `grid-area` CSS property value.
 */
export const gridArea = ({
	x = 0,
	y = 0,
	endX = x + 1,
	endY = y + 1,
}: GridAreaProps): string => `${y + 1} / ${x + 1} / ${endY + 1} / ${endX + 1}`;
