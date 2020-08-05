<script>
  import { goto } from '@sapper/app';

  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade';
  import AppIcon from 'src/components/AppIcon.svelte';
  import { Button } from 'src/components/form';
</script>

<div class="main-content fixed-height" in:fadeIn out:fadeOut>
  <div class="hero-bg">
    <div class="icon-container">
      <AppIcon color="var(--primary-text)" borderColor="transparent" />
    </div>
    <div class="hero-content">
      <h1>meetwhen</h1>
      <p>Find the perfect time to meet up with your group</p>
    </div>
  </div>
  <Button on:click={() => goto('/new')}>New Event</Button>
</div>

<style>
  .main-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .hero-bg {
    position: relative;
    width: 100vw;
    min-height: 30vh;
    padding: 1em;
    margin-bottom: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-gradient-dark) 100%);
  }

  .icon-container {
    width: 64px;
    height: 64px;
    margin-top: 6px;
    margin-right: 0.4em;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    color: var(--primary-text);
  }

  h1 {
    color: var(--primary-text);
  }
</style>
