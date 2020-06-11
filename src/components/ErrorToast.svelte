<script>
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  // BINDINGS
  // ========
  // Error message needs to be bound to allow the same message to trigger
  // multiple reactive updates.
  export let errorMessage = '';
  $: updateDisplayedMessages(errorMessage);

  // PROPS
  // =====
  export let messageDuration = 3000;

  // STATE
  // =====
  // Use an array to allow one message to fade away while the next fades in.
  let displayedMessages = [];
  let timer = null;

  // STATE FUNCTIONS
  // ===============
  async function updateDisplayedMessages(newMessage) {
    if (newMessage.trim().length === 0) return;
    if (timer) clearInterval(timer);
    displayedMessages = [ newMessage ];
    timer = setInterval(() => {
      displayedMessages = [];
      errorMessage = '';
    }, messageDuration);
  }
</script>

{#each displayedMessages as message (message)}
  <div in:fly={{y: 200, duration: 300, easing: cubicOut}} out:fade>
    <span>{message}</span>
  </div>
{/each}

<style>
  div {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 5rem;
    z-index: 90;
    display: flex;
    justify-content: center;
  }

  span {
    font-size: 0.8rem;
    padding: 0.8rem;
    color: white;
    background-color: var(--error-0);
    border-radius: 5px;
    box-shadow: var(--shadow-med);
  }

  @media screen and (min-width: 768px) {
    div {
      bottom: 2rem;
    }
  }
</style>