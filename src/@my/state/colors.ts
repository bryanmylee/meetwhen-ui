import chroma from 'chroma-js';
import flat from '@my/utils/flat';
import range from '@my/utils/range';
import { writable } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { Scale } from 'chroma-js';

interface Updater<T> {
  (toUpdate: T): T;
}

export interface IColor {
  DEFAULT: string;
  scale: Scale;
  lighter: string;
  darker: string;
  warmer: string;
  cooler: string;
  'opacity-30': string;
  'opacity-60': string;
}

const hueShifted = (color: chroma.Color, shift: number) => {
  const hue = color.get('hsl.h');
  return color.set('hsl.h', hue + shift);
};

const scaleFromHex = (hex: string) => {
  const base = chroma(hex);
  const light = base.brighten(1.8).desaturate();
  const dark = base.darken(1.8);
  return chroma.scale([light, base, dark]).mode('lrgb');
}


const color = (base: string): IColor => ({
  DEFAULT: chroma(base).css(),
  scale: scaleFromHex(base),
  lighter: chroma(base).brighten(0.5).css(),
  darker: chroma(base).darken(0.5).css(),
  warmer: hueShifted(chroma(base), -10).css(),
  cooler: hueShifted(chroma(base), 10).css(),
  'opacity-30': chroma(base).alpha(0.3).css(),
  'opacity-60': chroma(base).alpha(0.6).css(),
});

const property = (prop: string, variant: string) => {
  if (variant === 'DEFAULT') return `--${prop}`;
  return `--${prop}-${variant}`;
}

const updateCssVars = (name: string, colors: IColor) => {
  if (typeof document === 'undefined') return;
  Object.entries(colors).forEach(([variant, value]) => {
    document.documentElement.style.setProperty(property(name, variant), value);
  });
}

const useColor = (name: string, initColor: string):
    [Writable<string>, Readable<IColor>] => {
  const base = writable(initColor);
  const initColors = color(initColor);
  updateCssVars(name, initColors);
  const colors = writable(initColors);

  const updateBase = (fn: Updater<string>) => {
    base.update($base => {
      const newBase = fn($base);
      if (!chroma.valid(newBase)) return $base;

      const newColors = color(newBase);
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

const hues = range(0, 360, 40);
const sats = range(0.25, 1, 0.25);
const brightColors = flat(hues.map(hue => sats.map(sat => chroma.hsl(hue, sat, 0.52).hex())));
const greyColors = range(0.3, 0.8, 0.2).map(light => chroma.hsl(0, 0, light).hex());

export const colors = [...brightColors, ...greyColors];
export const DEFAULT_PRIMARY_INDEX = 17;
export const [primaryBase, primary] = useColor('primary', colors[DEFAULT_PRIMARY_INDEX]);

