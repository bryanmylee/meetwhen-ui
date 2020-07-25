<script>
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';

  // BINDINGS
  // ========
  // The toast component needs to be able to 'reset' the value of the error
  // message such that the same message can be used to trigger another reactive
  // update.
  export let errorMessage = '';
  $: updateDisplayedMessages(errorMessage);

  // PROPS
  // =====
  export let messageDuration = 3000;

  // STATE
  // =====
  // Track all unique messages with timestamp
  let displayedMessages = [];

  // STATE FUNCTIONS
  // ===============
  async function updateDisplayedMessages(newMessage) {
    if (newMessage.trim().length === 0) return;

    const timestamp = new Date().getTime();
    displayedMessages = [...displayedMessages, {
      timestamp,
      content: newMessage,
      timer: setInterval(() => {
        displayedMessages = displayedMessages
          .filter((message) => message.timestamp !== timestamp || message.content !== newMessage);
      }, messageDuration),
    }];
    errorMessage = '';
  }
</script>

<div>
  {#each displayedMessages as { content, timestamp } (`${content}${timestamp}`)}
    <span
      in:fly={{ y: 200, duration: 300, easing: cubicOut }}
      out:fade
      animate:flip={{ duration: 300, easing: cubicOut }}
    >
      {content}
    </span>
  {/each}
</div>

<style>
  div {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 5rem;
    z-index: 90;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  span {
    font-size: 0.8rem;
    margin-top: 0.8em;
    padding: 0.8em;
    color: var(--error-text);
    background-color: var(--error-500);
    border-radius: 5px;
    box-shadow: var(--shadow-med);
  }

  @media screen and (min-width: 768px) {
    div {
      bottom: 2rem;
    }
  }
</style>