<script>
  export let label = "Label";
  export let isPassword = false;
  export let value;
</script>

<div>
  {#if isPassword}
    <input type="password" bind:value={value} required/>
  {:else}
    <input type="text" bind:value={value} required/>
  {/if}
  <span class="bar"></span>
  <label>{label}</label>
</div>

<style>
  div {
    position: relative;
    width: 300px;
    margin-bottom: 20px;
  }

  input {
    font-size: 1em;
    width: 100%;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #757575;
    padding: 10px 10px 5px 5px;
    margin-bottom: 1px;
  }

  input:focus {
    outline: none;
  }

  label {
    font-size: 1em;
    color: #999;
    position: absolute;
    left: 5px;
    top: 10px;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
    pointer-events: none;
  }

  input:focus ~ label,
  input:valid ~ label {
    font-size: 0.8em;
    top: -0.6em;
    color: #62B2F2;
  }

  .bar {
    position: absolute;
    left: -50%;
    display: block;
    width: 100%;
  }

  .bar:before {
    position: absolute;
    content: '';
    width: 0;
    height: 2px;
    bottom: 1px;
    background-color: #62B2F2;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }

  input:focus ~ .bar:before {
    width: 100%;
  }
</style>