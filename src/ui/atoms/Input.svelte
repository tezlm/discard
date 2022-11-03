<script lang="ts">
export let type = "text";
export let value = "";
export let placeholder = "";
export let small = false;
export let autofocus = false;
export let readonly = false;
export let optional = false;
export let autoselect = false;
export let submitted = (_: string, _2: KeyboardEvent) => {};
export let escaped = (_: KeyboardEvent) => {};

function handleInput(e: InputEvent) {
  value = (e.target as HTMLInputElement).value;
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.stopPropagation();
    e.preventDefault();
    if (value || optional) submitted(value, e);
  } else if (e.key === "Escape") {
    escaped(e);
  }
}

function handleFocus(e: FocusEvent) {
  if (autoselect) (e.target as HTMLInputElement).select();
}
</script>
<style>
input {
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
  border-radius: 3px;
  background: var(--bg-spaces);
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
  on:focus={handleFocus}
/>
