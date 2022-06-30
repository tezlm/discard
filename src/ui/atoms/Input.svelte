<script>
export let type = "text";
export let value = "";
export let placeholder = "";

function handleInput(e) {
  value = e.target.value;
}
</script>
<style>
input {
  font-family: var(--font-primary);
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 3px;
  color: inherit;
  background: #202225;
  outline: none;
}
</style>
<input {type} on:input={handleInput} placeholder={placeholder} />
