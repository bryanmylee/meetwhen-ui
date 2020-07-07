<script>
  import { TextInput } from 'src/components/form';
  import { getRequired } from 'src/utils/validation';

  // BINDINGS
  // ========
  export let title;
  export let description;

  // PROPS
  // =====
  export let attempted;

  // STATE
  // =====
  let titleValid;
</script>

<div
  class="card outline padded"
  class:error={attempted && !titleValid}
>
  <h3>Name your event</h3>
  <TextInput label="Title" bind:value={title} bind:valid={titleValid}
    {attempted} validationFunction={getRequired('Title cannot be empty')}
    style="margin-top: 1rem" />
  <TextInput label="Description" bind:value={description} isPassword
    style="margin-top: 1rem" />
</div>