<script>
  import { createEventDispatcher } from 'svelte';

  import { getRequired } from 'src/utils/validation';
  import { KEY_RETURN } from 'src/utils/constants';

  import { TextInput } from 'src/components/form';

  const dispatch = createEventDispatcher();

  // BINDINGS
  // ========
  export let title;
  export let description;
  export let formValid;

  // PROPS
  // =====
  export let attempted;

  // STATE
  // =====
  let titleValid;
  $: formValid = titleValid;

  function handleKeydown(event) {
    if (event.keyCode === KEY_RETURN) {
      event.preventDefault();
      dispatch('submit');
    }
  }
</script>

<div
  class="card outline padded"
  class:error={attempted && !titleValid}
>
  <h3>Name your event</h3>
  <TextInput label="Title"
    bind:value={title} bind:valid={titleValid}
    on:keydown={handleKeydown}
    required {attempted}
    validationFunction={getRequired('Your event title cannot be empty')}
    style="margin-top: 1em" />
  <TextInput label="Description"
    bind:value={description}
    on:keydown={handleKeydown}
    style="margin-top: 1em" />
</div>