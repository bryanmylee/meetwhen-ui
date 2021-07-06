type Vars = Record<string, string | number>;

export const cssVars = (vars: Vars): string =>
  Object.entries(vars)
    .map(([key, value]) => `--${key}:${value}`)
    .join(';');
