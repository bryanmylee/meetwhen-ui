<script>
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';

  // BINDINGS
  // ========
  // The toast component needs to be able to 'reset' the value of the error
  // message such that the same message can be used to trigger another reactive
  // update.
  export let message = '';
  $: updateDisplayedMessages(message);

  // PROPS
  // =====
  export let error = false;
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
          .filter((msg) => msg.timestamp !== timestamp || msg.content !== newMessage);
      }, messageDuration),
    }];
    message = '';
  }
</script>

<div>
  {#each displayedMessages as { content, timestamp } (`${content}${timestamp}`)}
    <span
      class:error={error}
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
    bottom: 5em;
    z-index: 90;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  span {
    font-size: 0.8em;
    margin-top: 0.8em;
    padding: 0.8em;
    color: var(--primary-500);
    background-color: var(--bg);
    border-radius: 5px;
    box-shadow: var(--shadow-small);
  }

  span.error {
    color: var(--error-500);
  }

  @media screen and (min-width: 768px) {
    div {
      bottom: 2em;
    }
  }
</style>
