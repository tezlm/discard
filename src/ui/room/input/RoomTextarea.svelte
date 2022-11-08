<script>
import { tick } from "svelte";
export let oninput = () => {};
export let onfile = () => {};
export let textarea;
export let placeholder;
export let input = "";
export let asdfasdfasdf = false; // i am very good at naming
$: rows = asdfasdfasdf ? 8 : Math.min(input.split("\n").length, 10);

function handleKeyDown(e) {
  if (e.ctrlKey) {
    async function wrapInsert(chars) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = input.slice(0, start);
      const between = input.slice(start, end);
      const after = input.slice(end);
      
      if (before.slice(-chars.length) === chars && after.slice(0, chars.length) === chars) {
        // unwrap the characters if they already exist
        input = before.slice(0, -chars.length) + between + after.slice(chars.length);
        await tick();
        textarea.selectionStart = before.length - chars.length;
        textarea.selectionEnd = before.length - chars.length + between.length;
      } else {
        // otherwise, wrap/instert the characters
        input = before + chars + between + chars + after;
        await tick();
        textarea.selectionStart = before.length + chars.length;
        textarea.selectionEnd = before.length + chars.length + between.length;
      }
    }
    
    switch (e.key) {
      case "b": return wrapInsert("**");
      case "i": return wrapInsert("*");
      // case "u": return wrapInsert("__");
    }
  }
  if (e.key !== "Enter" || (asdfasdfasdf ? !e.ctrlKey : e.shiftKey)) return;
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
  resize: none;
  flex: 1;
  padding: 12px 0;
}

textarea::placeholder {
  color: var(--fg-dim);
}

textarea.asdfasdfasdf {
}
</style>
<textarea
  {placeholder}
  {rows}
  class:asdfasdfasdf
  bind:this={textarea}
  bind:value={input}
  on:keydown={handleKeyDown}
  on:paste={handlePaste}
></textarea>
