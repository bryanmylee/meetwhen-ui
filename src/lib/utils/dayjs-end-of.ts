import type { Dayjs, OpUnitType } from 'dayjs';

export const endOf = (day: Dayjs, unit: OpUnitType): Dayjs => {
  return day.add(1, unit).startOf(unit);
};
