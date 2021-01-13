import type { Modifier } from '@popperjs/core';

export type ScrollToNthChildModifier
    = Modifier<'scrollToNthChild', { childIndex: number }>;

const scrollToNthChild: ScrollToNthChildModifier = {
  name: 'scrollToNthChild',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['computeStyles'],
  fn: () => {},
  effect: ({ instance, options, state }) => {
    instance.update().then(() => {
      const { childIndex } = options;
      const { popper } = state.elements;
      const item = popper.children.item(childIndex) as HTMLElement;
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
    }).then(({ instance }) => {
      instance.update();
    });
  },
};

export default scrollToNthChild;

