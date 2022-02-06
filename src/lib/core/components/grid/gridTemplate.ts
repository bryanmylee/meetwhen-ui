export interface GridTemplateProps {
	rows?: number;
	cols?: number;
}

/**
 * Simplify the creation of rows and columns with CSS grid by generating the
 * appropriate value for the `grid-template` CSS property value.
 * @param props.rows The number of rows for the grid.
 * @param props.cols The number of columns for the grid.
 * @returns The `grid-template` CSS property value.
 */
export const gridTemplate = ({
	rows = 1,
	cols = 1,
}: GridTemplateProps): string =>
	`repeat(${rows}, auto) / repeat(${cols}, auto)`;
