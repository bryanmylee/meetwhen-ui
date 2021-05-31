import type { IntervalDTO } from '$lib/gql/types';
import type { Moment } from '$lib/utils/moment';

export const union = (intervals: IntervalDTO[]): IntervalDTO[] => {
  const moments: Moment[] = [];
  intervals.forEach(({ beg, end }) => {
    moments.push({ unix: beg, end: false }, { unix: end, end: true });
  });
  moments.sort((a, b) => a.unix - b.unix);
  const result: IntervalDTO[] = [];
  let currentBeg = null;
  let depth = 0;
  moments.forEach((moment) => {
    if (moment.end) {
      depth--;
      if (depth === 0) {
        result.push({ beg: currentBeg, end: moment.unix });
      }
    } else {
      depth++;
      if (depth === 1) {
        currentBeg = moment.unix;
      }
    }
  });
  return result;
};
