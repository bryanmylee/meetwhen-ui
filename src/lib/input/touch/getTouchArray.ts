export const getTouchArray = (touchList: TouchList): Touch[] =>
	[...Array(touchList.length)].map((_, i) => touchList.item(i)) as Touch[];
