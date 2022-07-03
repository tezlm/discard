<script>
export let value = "";
export let placeholder = "";

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
  background: #202225;
  outline: none;
  resize: none;
}
</style>
<textarea {value} on:input={handleInput} placeholder={placeholder} rows=6 />
