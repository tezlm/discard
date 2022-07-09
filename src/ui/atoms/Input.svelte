<script>
export let type = "text";
export let value = "";
export let placeholder = "";
export let small = false;
export let autofocus = false;
export let submitted = () => {};

function handleInput(e) {
  value = e.target.value;
}

function handleKeyDown(e) {
  if (e.key === "Enter") {
    e.stopPropagation();
    if (value) submitted();
  }
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

.small {
  height: 20px;
  font-size: 14px;
  padding: 16px 8px;
}
</style>
<input
  {type}
  {placeholder}
  {value}
  {autofocus}
  class:small
  on:input={handleInput}
  on:keydown={handleKeyDown}
/>
