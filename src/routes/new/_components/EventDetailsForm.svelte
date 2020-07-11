<script>
  import { TextInput } from 'src/components/form';
  import { getRequired } from 'src/utils/validation';

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
</script>

<div
  class="card outline padded"
  class:error={attempted && !titleValid}
>
  <h3>Name your event</h3>
  <TextInput label="Title" bind:value={title} bind:valid={titleValid}
    required {attempted} validationFunction={getRequired('Your event title cannot be empty')}
    style="margin-top: 1rem" />
  <TextInput label="Description" bind:value={description}
    style="margin-top: 1rem" />
</div>