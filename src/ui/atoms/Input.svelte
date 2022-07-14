<script>
export let type = "text";
export let value = "";
export let placeholder = "";
export let small = false;
export let autofocus = false;
export let readonly = false;
export let optional = false;
export let submitted = () => {};

function handleInput(e) {
  value = e.target.value;
}

function handleKeyDown(e) {
  if (e.key === "Enter") {
    e.stopPropagation();
    e.preventDefault();
    if (value || optional) submitted();
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
  background: var(--bg-spaces);
  outline: none;
}

.small {
  height: 20px;
  font-size: 14px;
  padding: 14px 8px;
}

.readonly {
  background: var(--bg-rooms-members);
}
</style>
<input
  {type}
  {placeholder}
  {value}
  {autofocus}
  {readonly}
  class:small
  class:readonly
  on:input={handleInput}
  on:keydown={handleKeyDown}
/>
