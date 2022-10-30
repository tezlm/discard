<script>
export let oninput = () => {};
export let onfile = () => {};
export let textarea;
export let placeholder;
export let input = "";
$: rows = Math.min(input.split("\n").length, 10);

function handleKeyDown(e) {
  if (e.key !== "Enter" || e.shiftKey) return;
  e.preventDefault();
  e.stopImmediatePropagation();

  if (!input.trim()) return;
  oninput(input, textarea);

  input = "";
}

function handlePaste(e) {
  if (e.clipboardData.files.length) e.preventDefault();
  onfile(e.clipboardData.files[0], textarea);
}
</script>
<style>
textarea {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  outline: none;
  resize: none;

  flex: 1;
  padding: 12px 0;
}

textarea::placeholder {
  color: var(--fg-dim);
}
</style>
<textarea
  {placeholder}
  {rows}
  bind:this={textarea}
  bind:value={input}
  on:keydown={handleKeyDown}
  on:paste={handlePaste}
></textarea>
