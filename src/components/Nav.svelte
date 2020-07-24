<script>
  import { stores } from '@sapper/app';

  const { page } = stores();
</script>

<nav>
  <ul>
    <a href="/" class="hero">meetwhen</a>
  </ul>
  <ul>
    <a rel=prefetch href="/new" class:active={$page.path === '/new'}>New Event</a>
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
    padding: 0 1rem;
    background-color: var(--background-0);
    border-bottom: 1px solid var(--line-1);
    box-sizing: border-box;
  }

  ul {
    display: flex;
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--text-0);
  }

  .hero {
    font-weight: 800;
  }

  .active {
    color: var(--primary-1-0);
  }
</style>