import type { IntervalDTO } from '$lib/gql/types/interval';

export const getLocalizedIntervals = (intervals: IntervalDTO[]): IntervalDTO[] => {
  if (intervals.length === 0) {
    return [];
  }
};
