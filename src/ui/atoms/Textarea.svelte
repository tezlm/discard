<script lang="ts">
export let value = "";
export let placeholder = "";
export let readonly = false;
 
function handleInput(e) {
  value = e.target.value;
}
</script>
<style>
textarea {
  font-family: var(--font-primary);
  font-size: 16px;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 3px;
  color: inherit;
  background: var(--bg-spaces);
  outline: none;
  resize: none;
}

.readonly {
  background: var(--bg-rooms-members);
}
</style>
<textarea
  {value}
  {readonly}
  placeholder={placeholder}
  rows=3
  class:readonly
  on:input={handleInput}
/>
