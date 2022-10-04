<script>
import lexical from "lexical";
import { registerRichText } from "@lexical/rich-text";
import { registerPlainText } from "@lexical/plain-text";
import { createEmptyHistoryState, registerHistory } from "@lexical/history";
import { onMount } from "svelte";
import md from "simple-markdown";
let editorEl;
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

$: console.log("new content:", JSON.stringify({ content, html }))
*/

const editor = createEditor({});
onMount(() => {
  editor.setRootElement(editorEl);
  registerPlainText(editor);
  registerHistory(editor, createEmptyHistoryState(), 1000);
  // editor.addTransform(lexical.TextNode, (node) => {
  //   const txt = node.getTextContent();
  //   console.log(node, txt)
  //   if (txt === "ayo") {
  //     node.replace(lexical.$createTextNode("among"));
  //   }
  // });
});

/*
import { useEffect } from "react";
import { $createEmoticonNode } from "./EmoticonNode";
import { TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function emoticonTransform(node) {
  const textContent = node.getTextContent();
  if (textContent === ":avo:") {
    node.replace($createEmoticonNode("emoticon avo-emoticon", "avo"));
  } else if (textContent === ":)") {
    node.replace($createEmoticonNode("", "🙂"));
  }
}

function useEmoticons(editor) {
  useEffect(() => {
    const removeTransform = editor.addTransform(TextNode, emoticonTransform);
    return () => {
      removeTransform();
    };
  }, [editor]);
}

export default function EmoticonPlugin() {
  const [editor] = useLexicalComposerContext();
  useEmoticons(editor);
  return null;
}
*/
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
<div class="editor" contenteditable bind:this={editorEl}></div>
