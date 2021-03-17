export default (start: number, stop: number, step = 1) => {
  const interval = stop - start;
  const count = Math.ceil(interval / step);
  return [...Array(count)].map((_, i) => i * step + start);
};
