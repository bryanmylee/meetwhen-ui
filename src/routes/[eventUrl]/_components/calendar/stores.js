import { writable, derived } from 'svelte/store';

import { form, formEnum } from '../../_stores';

export const calendarSelectionEnabled = derived(
  form,
  ($form) => $form === formEnum.JOINING || $form === formEnum.EDITING,
);

export const isCreatingNewSelection = writable(false);

export const dragDropEnum = {
  NONE: 'NONE',
  MOVING: 'MOVING',
  RESIZING_TOP: 'RESIZING_TOP',
  RESIZING_BOTTOM: 'RESIZING_BOTTOM',
};

export const dragDropState = writable(dragDropEnum.NONE);
