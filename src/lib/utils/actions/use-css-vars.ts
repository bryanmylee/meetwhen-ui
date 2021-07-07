import type { Action } from '$lib/typings/action';

type Vars = Record<string, string | number>;

export const cssVars: Action<Vars> = (node, vars) => {
  updateCssVars(node, vars);
  return {
    update(newVars) {
      updateCssVars(node, newVars);
    },
  };
};

const updateCssVars = (node: HTMLElement, vars: Vars) => {
  Object.entries(vars).forEach(([key, value]) => {
    node.style.setProperty(`--${key}`, `${value}`);
  });
};
