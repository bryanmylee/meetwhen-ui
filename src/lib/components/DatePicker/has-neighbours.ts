import type { Dayjs } from 'dayjs';

export interface HasNeighbours {
	bottom: boolean;
	left: boolean;
	right: boolean;
	top: boolean;
}

export const hasNeighbours = (center: Dayjs, others: Dayjs[]): HasNeighbours => ({
	bottom: hasBottom(center, others),
	left: hasLeft(center, others),
	right: hasRight(center, others),
	top: hasTop(center, others),
});

const hasBottom = (center: Dayjs, others: Dayjs[]) => {
	return others.some((o) => center.isSame(o, 'M') && center.date() + 7 === o.date());
};

const hasLeft = (center: Dayjs, others: Dayjs[]) => {
	if (center.day() % 7 === 1) return false;
	return others.some((o) => center.isSame(o, 'M') && center.date() - 1 === o.date());
};

const hasRight = (center: Dayjs, others: Dayjs[]) => {
	if (center.day() % 7 === 0) return false;
	return others.some((o) => center.isSame(o, 'M') && center.date() + 1 === o.date());
};

const hasTop = (center: Dayjs, others: Dayjs[]) => {
	return others.some((o) => center.isSame(o, 'M') && center.date() - 7 === o.date());
};
