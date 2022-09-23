<script>
import md from "simple-markdown";

const rules = {
  ...md.defaultRules,
  mention: {
    order: 0,
    match: (source) => /^(@\S*:\S+)/.exec(source),
    parse: (cap) => ({ content: cap[1] }),
  },
}

const parse = md.parserFor(rules);

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
  const clean = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&gt;")
    .replace(/>/g, "&lt;")

  console.log(parse(clean, { inline: false }))
  
  return parse(clean, { inline: false }).map(render).join("\n\n");
  
  function render(node) {
    const content = node.content instanceof Array
      ? node.content.map(render).join("")
      : node.content;
  
    const m = (str, cls = "dim") => `<span class="${cls}">${str}</span>`;
  
    switch (node.type) {
      case "em": return `${m("*")}<em>${content}</em>${m("*")}`;
      case "strong": return `${m("**")}<strong>${content}</strong>${m("**")}`;
      case "inlineCode": return `<code>${m("`")}${content}${m("`")}</code>`;
      case "link": return `${m("[")}${content}${m("](")}${m(node.target, "link")}${m(")")}`;
      case "mention": return `<span data-mx-ping="${content}">${content}</span>`;
      default: return content;
    }  
  }
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
