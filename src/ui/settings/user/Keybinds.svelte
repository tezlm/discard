<script>
function handleKeyDown(e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  if (e.key === "Escape") return e.target.blur();
  if (e.key === "Enter")  return e.target.blur();

  let str = "";
  if (e.ctrlKey)  str += "ctrl + ";
  if (e.altKey)   str += "alt + ";
  if (e.shiftKey) str += "shift + ";
  str += e.key;

  e.target.value = str;
}
</script>
<style>
.keybind input {
  padding: 4px;
  color: inherit;
  font-family: var(--font-primary);
  font-size: 16px;
  border: solid transparent 1px;
  border-radius: 3px;
  background: var(--bg-spaces);
  outline: none;
}

.keybind input:focus {
  border: solid var(--color-accent) 1px;
}

span {
  color: var(--fg-muted);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  margin: 6px 0;
}
</style>
idk
<br>
<br>
<span>Copy</span>
<div class="keybind">
  <input on:keydown={handleKeyDown}>
</div>
<br /><span>Paste</span>
<div class="keybind">
  <input on:keydown={handleKeyDown}>
</div>
<br /><span>Edit Message</span>
<div class="keybind">
  <input on:keydown={handleKeyDown}>
</div>
<br />