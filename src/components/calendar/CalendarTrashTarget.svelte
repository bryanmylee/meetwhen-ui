<script>
  import TrashIcon from './TrashIcon.svelte';
</script>

<div class="calendar--trash-target">
  <TrashIcon />
</div>

<style>
  div {
    position: sticky;
    left: 50%;
    bottom: 1rem;
    z-index: 15;
    width: 3rem;
    height: 3rem;
    border-radius: 500px;
    padding: 0.8em;
    background-color: var(--error-50);
    box-shadow: var(--shadow-med);
  }

  div:hover {
    background-color: white;
    box-shadow: var(--shadow-large);
  }
</style>