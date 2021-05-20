import type { Modifier, OptionsGeneric, StrictModifiers } from '@popperjs/core';

export type SameWidthModifier = Modifier<'sameWidth', Record<string, never>>;
export const sameWidth: SameWidthModifier = {
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

export type ScrollToNthChildModifier = Modifier<'scrollToNthChild', { childIndex: number }>;
export const scrollToNthChild: ScrollToNthChildModifier = {
  name: 'scrollToNthChild',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['computeStyles'],
  fn: () => undefined,
  effect: ({ instance, options, state }) => {
    instance
      .update()
      .then(() => {
        const index = options.childIndex;
        const { popper } = state.elements;
        const item = popper.children.item(index) as HTMLElement;
        const {
          offsetLeft: x,
          offsetTop: y,
          offsetWidth: itemWidth,
          offsetHeight: itemHeight,
        } = item;
        const { width, height } = state.rects.popper;
        if (state.placement === 'top') {
          popper.scrollTo(x - width + itemWidth, y - height + itemHeight);
        } else {
          popper.scrollTo(x, y);
        }
        return { instance };
      })
      .then(({ instance }) => {
        instance.update();
      });
  },
};

export type SelectModifiers = StrictModifiers | SameWidthModifier | ScrollToNthChildModifier;
export const getOptions = (
  focusedIndex: number,
  referenceHeight: number
): OptionsGeneric<SelectModifiers> => ({
  placement: 'bottom',
  strategy: 'fixed',
  modifiers: [
    sameWidth,
    {
      ...scrollToNthChild,
      options: {
        childIndex: focusedIndex,
      },
    },
    {
      name: 'offset',
      options: {
        offset: [0, -referenceHeight],
      },
    },
  ],
});
