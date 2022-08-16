<script>
// TODO: undo/redo
export let content = "";
let html = "";
let editorEl;

function getCursorPos(root) {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  range.setStart(root, 0);
  return range.toString().length;
}

function setCursorPos(root, pos) {
  const sel = window.getSelection();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, (el) => {
    if (pos > el.textContent.length) {
      pos -= el.textContent.length;
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  });
  sel.removeAllRanges();

  const node = walker.nextNode() ?? root;
  const newRange = new Range();
  newRange.setStart(node, pos);
  sel.addRange(newRange);
}

function parseMarkdown(str) {
  function boldItalic(_, m, str) {
    const openTag = m.length === 3 ? "<b><em>"
      : m.length === 2 ? "<b>"
      : "<em>";
    const closeTag = m.length === 3 ? "</em><b>"
      : m.length === 2 ? "</b>"
      : "</em>";
    const markup = `<span class="dim">${m}</span>`;
    return `${openTag}${markup}${str}${markup}${closeTag}`;
  }

  function header(_, m, str) {
    const markup = `<span class="dim">${m}</span>`;
    return `<h${m.length}>${markup}${str}</h${m.length}>`;
  }

  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&gt;")
    .replace(/>/g, "&lt;")
    .replace(/^\/(\S*)/g, '<b><span class="dim">/</span>$1</b>')
    .replace(/([@#!])(\S+?):(\S+)/g, '<span data-mx-ping>$1$2:$3</span>')
    // .replace(/^(#{1,6})(.+)/g, header)
    .replace(/\n/g, "<br />")
    // .replace(/`(.+?)`/g, '<span class="dim">`</span><code>$1</code><span class="dim">`</span>')
    // .replace(/([@#!])(\S+?):(\S+)/g, '<span data-mx-ping>$1$2:$3</span>')
    // .replace(/([*_]{1,3})(.+?)\1/g, boldItalic)
    // .replace(/\[(.+?)\]\((.+?)\)/g, '<span class="dim">[</span>$1<span class="dim">](</span><span class="link">$2</span><span class="dim">)</span>')
}

function handlePaste(e) {
  const text = e.clipboardData.getData("text");
  const pos = getCursorPos(editorEl);
  content = content.slice(0, pos) + text + content.slice(pos);
  html = parseMarkdown(content);
  queueMicrotask(() => setCursorPos(editorEl, pos + text.length));
}

function handleInput(e) {
  if (e.inputType === "insertLineBreak") {
    const pos = getCursorPos(editorEl);
    content = content.slice(0, pos) + "\n" + content.slice(pos);
    html = parseMarkdown(content);
    queueMicrotask(() => setCursorPos(editorEl, pos + 1));
  } else {
    const pos = getCursorPos(editorEl);
    html = parseMarkdown(content);
    queueMicrotask(() => setCursorPos(editorEl, pos));
  }
}

$: console.log("new content:", JSON.stringify({ content, html }))
</script>
<style>
.editor {
  background: var(--mod-lighten);
  padding: 4px;
  white-space: pre-wrap;
}

.editor :global(.dim) {
  color: var(--fg-muted);
}

.editor :global(.link) {
  color: var(--color-link);
}

.editor :global([data-mx-ping]) {
  color: var(--fg-notice);
  font-weight: 500;
  background: var(--ping-bgalpha);
  padding: 0 2px;
  border-radius: 3px;
  cursor: pointer;
}
</style>
<div
  class="editor"
  contenteditable
  bind:this={editorEl}
  bind:innerHTML={html}
  bind:textContent={content}
  on:input={handleInput}
  on:paste|preventDefault|stopPropagation={handlePaste}
>
</div>
