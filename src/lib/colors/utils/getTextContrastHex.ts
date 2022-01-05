import chroma from 'chroma-js';

export const getTextContrastHex = (hex: string): string => {
	if (chroma.contrast(hex, '#fff') > 2.45) {
		return '#fff';
	}
	return '#000';
};
