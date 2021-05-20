export const getTouchArray = (list: TouchList): Touch[] =>
  [...Array(list.length)].map((_, i) => list.item(i));
