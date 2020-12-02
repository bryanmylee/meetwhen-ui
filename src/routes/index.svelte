<svelte:head>
  <title>meetwhen - quick group scheduling</title>
</svelte:head>

<script>
  import { goto } from '@sapper/app';
  import { onMount } from 'svelte';
  import { currentColor } from 'src/stores';
  import { colors } from 'src/utils/colors';

  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade';
  import AppIcon from 'src/components/AppIcon.svelte';
  import { Button } from 'src/components/form';

  onMount(() => currentColor.setBaseColor(colors.blue500));
</script>

<div class="fixed-height" in:fadeIn out:fadeOut>
  <div class="top-container">
    <div class="icon-container">
      <AppIcon color="var(--primary-text)" borderColor="transparent" />
    </div>
    <div class="hero-content">
      <h1>meetwhen</h1>
      <p>Find the perfect time to meet up with your team</p>
    </div>
  </div>
  <div class="bottom-container">
    <Button on:click={() => goto('/new')}>New Event</Button>
  </div>
</div>

<style>
  .fixed-height {
    display: flex;
    flex-direction: column;
  }

  .top-container {
    flex: 1;
    width: 100vw;
    padding: 1em;
    margin-bottom: 1em;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-gradient-dark) 100%);
  }

  .bottom-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
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
