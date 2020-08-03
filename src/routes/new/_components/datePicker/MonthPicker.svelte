<script>
  import dayjs from 'dayjs';

  import CaretLeft from 'src/components/icons/CaretLeft.svelte';
  import CaretRight from 'src/components/icons/CaretRight.svelte';

  export let month = dayjs();
</script>

<div>
  <span> {month.format('MMM')} </span>
  <button on:click={() => month = month.subtract(1, 'month')}>
    <CaretLeft color="var(--grey-400)"/>
  </button>
  <button on:click={() => month = month.add(1, 'month')}>
    <CaretRight color="var(--grey-400)"/>
  </button>
</div>

<style>
  span {
    font-weight: 800;
  }

  div {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  button {
    outline: none;
    border: none;
    border-radius: 500px;
    background-color: transparent;
    transition: all 200ms ease;
  }

  button:hover, button:focus {
    background-color: var(--grey-100);
  }

  button:active {
    background-color: var(--grey-300);
  }

  button:first-of-type {
    margin-left: 0.8em;
  }
</style>