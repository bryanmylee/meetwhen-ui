<script>
  export let day;
  export let hour;
</script>

<div data-day={+day} data-hour={hour} />

<style>
  div {
    width: 100%;
    min-height: calc(var(--row-height) / 4);
    border-bottom: 1px solid transparent;
  }

  div:nth-child(4n) {
    border-bottom: 1px solid var(--grey-200);
  }

  div:hover {
    background-color: var(--primary-50);
    border-radius: 5px;
  }
</style>