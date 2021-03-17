export const getTouchArray = (list: TouchList) =>
  [...Array(list.length)].map((_, i) => list.item(i));
