<script>
  import { fade } from 'svelte/transition';

  import CalendarPicker from './CalendarPicker.svelte';
</script>

<div class="new-event-container" transition:fade>
  <h1>New Event</h1>
  <form>
    <label>Title</label>
    <input type="text">
    <label>Description</label>
    <input type="text">
    <label>Username</label>
    <input type="text">
    <label>Password</label>
    <input type="password">
  </form>
  <CalendarPicker />
</div>