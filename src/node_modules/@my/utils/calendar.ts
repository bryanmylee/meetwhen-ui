import type { Dayjs } from 'dayjs';

export const hasLeft = (center: Dayjs, others: Dayjs[]) => {
  if (center.day() % 7 === 1) return false;
  return others.some(o =>
    center.isSame(o, 'M') && center.date() - 1 === o.date()
  );
};

export const hasRight = (center: Dayjs, others: Dayjs[]) => {
  if (center.day() % 7 === 0) return false;
  return others.some(o =>
    center.isSame(o, 'M') && center.date() + 1 === o.date()
  );
};

export const hasTop = (center: Dayjs, others: Dayjs[]) => {
  return others.some(o =>
    center.isSame(o, 'M') && center.date() - 7 === o.date()
  );
};

export const hasBottom = (center: Dayjs, others: Dayjs[]) => {
  return others.some(o =>
    center.isSame(o, 'M') && center.date() + 7 === o.date()
  );
};

