<script lang="ts">
  import SelectState from '@my/models/SelectState';
  import type { Dayjs } from "dayjs";

  export { className as class };
  let className = '';

  export let day: Dayjs;
  export let halfHour: Dayjs;
  export let selected = false;
  export let selecting: SelectState;
  $: creating = selecting === SelectState.CREATE;
  $: deleting = selecting === SelectState.DELETE;

  export let disabled = false;
  export let focused = false;

  export let hasTop = false;
  export let hasBottom = false;
</script>

<div
  data-id={day.format('YYYYMMDD') + halfHour.format('HHmm')}
  class={`${className} ml-1/4 rounded-xl
    border-3 border-transparent focus:outline-none
    ${selected
      ? `bg-primary shadow-primary z-10
        ${creating ? 'shadow-lg-primary bg-primary-lighter' : ''}
        ${deleting ? 'bg-primary-opacity-60' : ''}
        ${hasTop ? 'rounded-t-none' : ''}
        ${hasBottom ? 'rounded-b-none' : ''}
        ${focused ? 'border-white' : ''}
      `
       : `z-0
       ${focused ? 'border-primary-lighter' : ''}
       ${!selecting && !disabled ? 'hover:bg-gray-200' : ''}
    `}
    ${disabled ? '' : 'cursor-pointer'}
  `.replace(/\s\s+/g, ' ')}
/>

