<script lang="ts" context="module">
  export interface SelectableProviderEvent {
    select: {
      id: string;
    };
    deselect: {
      id: string;
    };
    toggle: {
      id: string;
    };
  }
</script>

<!--component
  SelectableProvider provides selection functionality for mouse and touch
  devices (with long touch and drag).

  Child elements that are to be selectable must contain a dataset which includes
  an id: string.

  SelectableProvider then exposes an array of ids representing the elements
  selected, and the selecting state: enum { 0: NONE, 1: CREATE, 2: DELETE }.
-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<SelectableProviderEvent>();
  import { clearAllBodyScrollLocks, disableBodyScroll} from 'body-scroll-lock';
  import LongTouchProvider from '@my/components/LongTouchProvider.svelte';
  import SelectState from '@my/models/SelectState';
  import { getTouchArray } from '@my/utils/touch';

  const withAdded = (others: string[], toAdd: string) => {
    if (others.some(o => o === toAdd)) return others;
    return [...others, toAdd];
  };
  const withoutRemoved = (others: string[], toRemove: string) => {
    return others.filter(o => o !== toRemove);
  };

  export let disabled = false;
  export let disabledIds: string[] = [];
  export let selectedIds: string[] = [];
  export let selecting = SelectState.NONE;

  function isDisabled(id: string) {
    return disabledIds.includes(id);
  }

  export function select(id: string) {
    if (isDisabled(id)) return;
    selectedIds = withAdded(selectedIds, id);
    dispatch('select', { id });
    dispatch('toggle', { id });
  }

  export function deselect(id: string) {
    if (disabledIds.includes(id)) return;
    selectedIds = withoutRemoved(selectedIds, id);
    dispatch('deselect', { id });
    dispatch('toggle', { id });
  }

  export function toggle(id: string) {
    if (selectedIds.includes(id)) {
      deselect(id);
    } else {
      select(id);
    }
    dispatch('toggle', { id });
  }

  function startSelectionFrom(target: HTMLElement) {
    if (disabled) return;
    const { id } = target.dataset;
    if (id == null) return;
    if (selectedIds.includes(id)) {
      deselect(id);
      if (selecting === SelectState.NONE) {
        selecting = SelectState.DELETE;
      }
    } else {
      select(id);
      if (selecting === SelectState.NONE) {
        selecting = SelectState.CREATE;
      }
    }
  }

  function mousestart(event: MouseEvent) {
    const target = event.target as HTMLElement;
    startSelectionFrom(target);
  }

  let tracked: Record<number, Touch> = {};

  function longtouchstart(event: CustomEvent) {
    const touchEvent = event.detail.event as TouchEvent;
    const changedTouches = getTouchArray(touchEvent.changedTouches);
    changedTouches.forEach(touch => track(touch, touchEvent));
  }

  function track(touch: Touch, event: TouchEvent) {
    tracked[touch.identifier] = touch;
    const target = event.target as HTMLElement;
    disableBodyScroll(target);
    startSelectionFrom(target);
  }

  function updateSelection(target: HTMLElement) {
    if (disabled) return;
    const { id } = target.dataset;
    if (id == null) return;
    if (selecting === SelectState.CREATE) {
      select(id);
    } else {
      deselect(id);
    }
  }

  function mousemoveinto(event: MouseEvent) {
    if (selecting === SelectState.NONE) return;
    const target = event.target as HTMLElement;
    updateSelection(target);
  }

  function longtouchmove(event: CustomEvent) {
    const touchEvent = event.detail.event as TouchEvent;
    const changedTouches = getTouchArray(touchEvent.changedTouches);
    changedTouches.forEach(updateTouch);
  }

  function updateTouch(touch: Touch) {
    tracked[touch.identifier] = touch;
    if (selecting === SelectState.NONE) return;
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    updateSelection(target as HTMLElement);
  }

  function endSelection() {
    if (disabled) return;
    if (Object.keys(tracked).length === 0) {
      selecting = SelectState.NONE;
    }
  }

  function longtouchend(event: CustomEvent) {
    const touchEvent = event.detail.event as TouchEvent;
    const changedTouches = getTouchArray(touchEvent.changedTouches);
    changedTouches.forEach(untrack);
  }

  function untrack(touch: Touch) {
    delete tracked[touch.identifier];
    clearAllBodyScrollLocks();
    endSelection();
  }
</script>

<LongTouchProvider
  on:longtouchstart={longtouchstart}
  on:longtouchmove={longtouchmove}
  on:longtouchend={longtouchend}
  >
  <div
    on:mousedown={mousestart}
    on:mouseover={mousemoveinto}
    on:mouseleave={endSelection}
    on:mouseup={endSelection}
    class="contents"
    >
    <slot {selectedIds} {selecting} {isDisabled}/>
  </div>
</LongTouchProvider>

