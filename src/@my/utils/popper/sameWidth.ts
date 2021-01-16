import type { Modifier } from '@popperjs/core';

export type SameWidthModifier = Modifier<'sameWidth', {}>;

const sameWidth: SameWidthModifier = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['computeStyles'],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: ({ instance, state }) => {
    state.elements.popper.style.width = `${
      state.elements.reference.getBoundingClientRect().width
    }px`;
    instance.update();
  },
};

export default sameWidth;

