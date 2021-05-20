import { range } from '$lib/utils/range';
import dayjs, { Dayjs } from 'dayjs';
import { derived, Readable, Writable, writable } from 'svelte/store';

interface DatePickerState {
  month: Writable<Dayjs>;
  weekDays: Readable<Dayjs[]>;
  monthDates: Readable<Dayjs[]>;
  disabledDates: Readable<Dayjs[]>;
}

export const getDatePickerState = (): DatePickerState => {
  const month = writable(dayjs().startOf('month'));
  const weekDays = derived(month, ($month) => range(1, 8).map((day) => $month.day(day)));
  const monthDates = derived(month, ($month) =>
    range(1, $month.daysInMonth() + 1).map((date) => $month.date(date).startOf('day'))
  );
  const disabledDates = derived(monthDates, ($monthDates) =>
    $monthDates.filter((date) => date.isBefore(dayjs().startOf('day')))
  );
  return {
    month,
    weekDays,
    monthDates,
    disabledDates,
  };
};

export const toId = (date: Dayjs): string => date?.format('YYYYMMDD');
export const fromId = (id: string): Dayjs => dayjs(id, 'YYYYMMDD');
