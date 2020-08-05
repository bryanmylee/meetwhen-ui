<script>
  import AppIcon from 'src/components/AppIcon.svelte';
  import DarkModeToggle from './DarkModeToggle.svelte';

  export let segment = '';
  $: subtitle = segment === 'new' ? 'new' : '';
</script>

<nav>
  <ul>
    <a href="/" class="hero">
      <div>
        <AppIcon color="var(--icon-color)" borderColor="transparent"/>
      </div>
      <span><strong>meetwhen</strong> {subtitle}</span>
    </a>
  </ul>

  <ul>
    <DarkModeToggle/>
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