<script>
  import { setContext } from 'svelte';
  import { getMultiDaySelection } from '../../utils/selections.js';

  import CalendarIndexColumn from './CalendarIndexColumn.svelte';

  export let selections = [];
  // The new selection being made.
  let newSelection = null;
  // The current selection split into different days.
  export let newSelections = [];
  $: newSelections = getMultiDaySelection(newSelection);

  function startSelection(event) {
    const { datetime } = event.detail;
    newSelection = ({
      start: datetime,
      // datetime represents the start of the cell.
      // Add 15 minutes to account for the time in the last cell.
      end: datetime.add(15, 'minute'),
    });
  }

  function gridDrag(event) {
    const { datetime } = event.detail;
    // datetime represents the start of the cell.
    // Add 15 minutes to account for the time in the last cell.
    newSelection = ({ ...newSelection,
      end: datetime.add(15, 'minute'),
    });
  }

  function stopSelection() {
    if (!newSelection || !newSelection.start || !newSelection.end) return;
    selections = [
      ...selections,
      ...newSelections,
    ];
    newSelection = null;
  }

  setContext('select', ({
    startSelection,
    gridDrag,
    stopSelection,
  }))
</script>

<div id="picker" class="card">
  <!-- Wrapping the scrollable content in an extra div fixes a position:sticky
  bug on Safari 13.1 -->
  <div id="body">
    <CalendarIndexColumn />
    <slot />
  </div>
</div>

<style>
  :root {
    --index-col-width: 4rem;
    --header-row-height: 2rem;
    --col-width: 6rem;
    --row-height: 3rem;
  }

  #picker {
    width: auto;
    margin-bottom: 1em;
    overflow: scroll;
    scroll-behavior: smooth;
  }

  #body {
    display: flex;
    flex-direction: row;
    width: -moz-max-content;    /* Firefox */
    width: -webkit-max-content; /* Safari/Chrome */
  }

  :global(.cell) {
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>