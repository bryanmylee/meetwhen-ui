export const equals = <T>(a: Set<T>, b: Set<T>) => {
  if (a.size !== b.size) return false;
  a.forEach((e) => {
    if (b.has(e)) return false;
  });
  return true;
};
