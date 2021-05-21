import { flat } from '$lib/utils/flat';
import { range } from '$lib/utils/range';
import type { Scale } from 'chroma-js';
import chroma from 'chroma-js';
import type { Readable, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export interface IColor {
  DEFAULT: string;
  scale: Scale;
  lighter: string;
  darker: string;
  warmer: string;
  cooler: string;
  fifty: string;
  thirty: string;
}

const useColor = (name: string, initColor: string): [Writable<string>, Readable<IColor>] => {
  const base = writable(initColor);
  const initColors = getColors(initColor);
  updateCssVars(name, initColors);
  const colors = writable(initColors);

  const updateBase = (fn: (s: string) => string) => {
    base.update(($base) => {
      const newBase = fn($base);
      if (!chroma.valid(newBase)) {
        return $base;
      }

      const newColors = getColors(newBase);
      updateCssVars(name, newColors);
      colors.set(newColors);
      return newBase;
    });
  };

  return [
    {
      subscribe: base.subscribe,
      update: updateBase,
      set: (newBase: string) => updateBase(() => newBase),
    },
    {
      subscribe: colors.subscribe,
    },
  ];
};

const getColors = (base: string): IColor => ({
  DEFAULT: chroma(base).css(),
  scale: colorScale(base),
  lighter: chroma(base).brighten(0.5).css(),
  darker: chroma(base).darken(0.5).css(),
  warmer: hueShifted(chroma(base), -10).css(),
  cooler: hueShifted(chroma(base), 10).css(),
  fifty: chroma(base).alpha(0.5).css(),
  thirty: chroma(base).alpha(0.3).css(),
});

const colorScale = (hex: string) => {
  const base = chroma(hex);
  const light = base.brighten(1.8).desaturate();
  const dark = base.darken(1.8);
  return chroma.scale([light, base, dark]).mode('lrgb');
};

const hueShifted = (color: chroma.Color, shift: number) => {
  const hue = color.get('hsl.h');
  return color.set('hsl.h', hue + shift);
};

const updateCssVars = (name: string, colors: IColor) => {
  if (typeof document === 'undefined') {
    return;
  }
  Object.entries(colors).forEach(([variant, value]) => {
    document.documentElement.style.setProperty(property(name, variant), value);
  });
};

const property = (prop: string, variant: string) => {
  if (variant === 'DEFAULT') {
    return `--${prop}`;
  }
  return `--${prop}-${variant}`;
};

const hues = range(0, 360, 40);
const sats = range(0.25, 1, 0.25);
// list of colors with varying hues and saturations.
const brightColors = flat(hues.map((hue) => sats.map((sat) => chroma.hsl(hue, sat, 0.52).hex())));
// list of greyscales with varying lightness.
const greyColors = range(0.3, 0.8, 0.2).map((light) => chroma.hsl(0, 0, light).hex());
export const allColors = [...brightColors, ...greyColors];

export const DEFAULT_INDEX = 17;
const defaultPrimaryColor = allColors[DEFAULT_INDEX];

export const [primaryBase, primary] = useColor('primary', defaultPrimaryColor);
