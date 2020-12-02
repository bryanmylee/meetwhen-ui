<script>
  import { fadeIn, fadeOut } from 'src/transitions/pageCrossfade';

  import AppIcon from 'src/components/AppIcon.svelte';
  import DarkModeToggle from './DarkModeToggle.svelte';

  export let segment = '';

  $: transparent = segment == null || segment === '';
  $: subtitle = segment === 'new' ? 'new' : '';
</script>

<nav class:transparent>
  <ul>
    {#if segment !== '' && segment != null}
      <a href="/" class="hero" in:fadeIn out:fadeOut>
        <div>
          <AppIcon color="var(--icon-color)" borderColor="transparent"/>
        </div>
        <span>meetwhen {subtitle}</span>
      </a>
    {/if}
  </ul>

  <ul>
    <DarkModeToggle forceWhite={transparent}/>
  </ul>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    z-index: 90;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1em;
    background-color: var(--bg);
    border-bottom: 1px solid var(--grey-400);
    box-sizing: border-box;
  }

  nav.transparent {
    background-color: transparent;
    border-bottom: none;
  }

  ul {
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }

  a {
    color: var(--text-900);
  }

  .hero {
    display: flex;
    align-items: center;
  }

  .hero > div {
    width: 32px;
    height: 32px;
    margin-right: 0.5em;
    --icon-color: var(--primary-500);
  }

  .hero > div:hover,
  .hero > div:focus,
  .hero > div:active {
    --icon-color: var(--primary-400);
  }
</style>
