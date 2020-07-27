import chroma from 'chroma-js';

export const colors = {
  blue500: { tint: 500, hex: '#2196F3', name: 'Blue' },
  cyan500: { tint: 500, hex: '#00BCD4', name: 'Cyan' },
  teal500: { tint: 500, hex: '#009688', name: 'Teal' },
  green500: { tint: 500, hex: '#4CAF50', name: 'Green' },
  amber500: { tint: 500, hex: '#FFC107', name: 'Amber' },
  orange500: { tint: 500, hex: '#FF9800', name: 'Orange' },
  red500: { tint: 500, hex: '#F44336', name: 'Red' },
  pink300: { tint: 300, hex: '#F06292', name: 'Pink' },
  purple500: { tint: 500, hex: '#9C27B0', name: 'Purple' },
  deepPurple500: { tint: 500, hex: '#673AB7', name: 'Deep Purple' },
  indigo500: { tint: 500, hex: '#3F51B5', name: 'Indigo' },
  blueGrey500: { tint: 500, hex: '#607D8B', name: 'Blue Grey' },
};

export function hexToScale(baseHex) {
  const base = chroma(baseHex);
  const light = base.brighten(1.8).desaturate();
  const dark = base.darken(1.8);
  return chroma.scale([light, base, dark]).mode('lrgb');
}

export function hexToGradientDark(hex) {
  const base = chroma(hex);
  return base.darken(0.8).saturate().hex();
}

export function getTint(baseHex, tint) {
  const tintScale = chroma.scale(['#FFF', baseHex, '#000'])
    .domain([0, 1000])
    .mode('lab');
  return tintScale(tint);
}
