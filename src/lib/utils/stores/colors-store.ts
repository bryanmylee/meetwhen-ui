import { cssVars } from '$lib/utils/css-vars';
import type { Color, Scale } from 'chroma-js';
import chroma from 'chroma-js';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

export interface ColorSet {
  DEFAULT: string;
  lighter: string;
  darker: string;
  warmer: string;
  cooler: string;
  fifty: string;
  thirty: string;
  text: string;
  scale: Scale;
  getFractional: (num: number, denom: number) => Color;
}

type CssVars = string;

export const useColor = (
  name: string,
  initColor: string,
  isDark: Readable<boolean>
): [Writable<string>, Readable<ColorSet>, Readable<CssVars>] => {
  const base = writable(initColor);
  const colorSet = derived([base, isDark], ([$base, $isDark]) => getColorSet($base, $isDark));
  const cssVars = derived([colorSet], ([$colorSet]) => getCssVars(name, $colorSet));
  return [base, colorSet, cssVars];
};

export const getColorSet = (base: string, isDark: boolean): ColorSet => {
  const scale = getColorScale(base, isDark);
  return {
    DEFAULT: chroma(base).css(),
    lighter: chroma(base).brighten(0.5).css(),
    darker: chroma(base).darken(0.5).css(),
    warmer: hueShifted(chroma(base), -12).css(),
    cooler: hueShifted(chroma(base), 12).css(),
    fifty: chroma(base).alpha(0.5).css(),
    thirty: chroma(base).alpha(0.3).css(),
    text: getTextContrastColor(base),
    scale,
    getFractional: getFractionalFromScale(scale),
  };
};

// scale(0 to 1) reflects least to most colors.
const getColorScale = (hex: string, isDark = false) => {
  const base = chroma(hex);
  const light = base.brighten(1).desaturate(0.5);
  const dark = base.darken(2);
  const scalePoints = isDark ? [dark, base, light] : [light, base, dark];
  return chroma.scale(scalePoints).mode('lrgb');
};

const ratioWithMin = (ratio: number, min: number) => {
  return ratio * (1 - min) + min;
};

const ratioWithMax = (ratio: number, max: number) => {
  return ratio * max;
};

// scale(0 to 1) reflects least to most colors.
const getFractionalFromScale = (scale: Scale) => (num: number, denom: number) => {
  const mostIndex = ratioWithMin(Math.min(1, denom / 10), 0.5);
  const index = ratioWithMax(num / denom, mostIndex);
  return scale(index).alpha(ratioWithMin(index, 0.2));
};

const hueShifted = (color: chroma.Color, shift: number) => {
  const hue = color.get('hsl.h');
  return color.set('hsl.h', hue + shift);
};

const WHITE = '#ffffff';
const BLACK = '#000000';

export const getTextContrastColor = (base: string): string => {
  if (chroma.contrast(base, WHITE) > 2.45) {
    return WHITE;
  }
  return BLACK;
};

export const getCssVars = (name: string, colors: ColorSet): string =>
  cssVars(
    Object.fromEntries(
      Object.entries(colors)
        .filter(([, value]) => typeof value === 'string')
        .map(([variant, value]) => [property(name, variant), value])
    )
  );

const property = (prop: string, variant: string) => {
  if (variant === 'DEFAULT') {
    return `${prop}`;
  }
  return `${prop}-${variant}`;
};

export const DEFAULT_PRIMARY_COLOR = '#0aadff';
