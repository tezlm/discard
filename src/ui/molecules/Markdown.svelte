<script>
import lexical from "lexical";
// import { registerPlainText } from "@lexical/plain-text";
// import { createEmptyHistoryState, registerHistory } from "@lexical/history";
// import { $generateHtmlFromNodes as renderHTML } from '@lexical/html';
import { onMount } from "svelte";
// import md from "simple-markdown";
import Autocomplete from "./Autocomplete.svelte";

// import {
//   $convertFromMarkdownString,
//   $convertToMarkdownString,
//   TRANSFORMERS,
// } from '@lexical/markdown';

// editor.update(() => {
//   const markdown = $convertToMarkdownString(TRANSFORMERS);
//   ...
// });

// editor.update(() => {
//   $convertFromMarkdownString(markdown, TRANSFORMERS);
// });

// let editorEl;
const { createEditor } = lexical;
/*
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
function parseMarkdown(str) {
  const clean = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&gt;")
    .replace(
    />/g, "&lt;")

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
*/

class MentionNode extends lexical.TextNode {
  constructor(user, key) {
    super("@" + user.name, key);
    // super(user.name, key);
    this.user = user;
  }
  
  static getType() {
    return "mention";
  }
  
  static clone(node) {
    return new MentionNode(node.user, node.__text, node.__key);
  }
  
  createDOM(config) {
    const el = super.createDOM(config);
    el.dataset.mxPing = this.user.id;
    return el;
  }  
}

const editor = createEditor({ namespace: "editor", nodes: [MentionNode] });

onMount(() => {
  // editor.setRootElement(editorEl);
  // registerPlainText(editor);
  // registerHistory(editor, createEmptyHistoryState(), 1000);
  
  // editor.registerNodeTransform(lexical.TextNode, (node) => {
    // console.log(renderHTML(node));
  // });
});

const users = [];
const addUser = (name) => {
  const id = `@${name.replace(/ /g, "-")}:celery.eu.org`;
  users.push({ name, id, description: id });
};
addUser("bread");
addUser("bruh");
addUser("tezlm");
addUser("username with spaces");
addUser("foo");
addUser("bar");
addUser("baz");
addUser("user");

function mention(id) {
  editor.update(() => {
    const sel = lexical.$getSelection();
    if (!lexical.$isRangeSelection(sel) || !sel.isCollapsed()) return;
    
    const anchor = sel.anchor;
    if (anchor.type !== "text") return;
    
    const anchorNode = anchor.getNode();
    const tex = anchorNode.getTextContent();
    const index = tex.indexOf("@");
    const [left, right] = anchorNode.splitText(index);
    
    const user = new MentionNode(users.find(i => i.id === id));
    user.setMode("token");
    (right ?? left).replace(user);
    user.select();
    // lexical.$insertNodes([user]);
  });
}
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
</style>
<!-- <div class="editor" contenteditable bind:this={editorEl}></div> -->
<div style="min-height: 1em"></div>
<Autocomplete type="user" selected={mention} options={users} />
