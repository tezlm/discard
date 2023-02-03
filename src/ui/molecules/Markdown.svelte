 <script>
import { onMount } from "svelte";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, Decoration } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { closeBrackets } from "@codemirror/autocomplete";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import Autocomplete from "./Autocomplete.svelte";
let editorEl;

// REMIND: codemirror has its own autocompletion, might be useful
const highlight = HighlightStyle.define([
  { 
    tag: tags.heading1,
    fontSize: "1.5em",
  },
  { 
    tag: tags.heading2,
    fontSize: "1.3em",
  },
  { 
    tag: tags.heading3,
    fontSize: "1.2em",
  },
  { 
    tag: tags.emphasis,
    fontStyle: "italic",
  },
  {
    tag: tags.strong,
    fontWeight: "bold",
  },
  {
    tag: tags.monospace,
    font: "14px/1.125rem var(--font-monospace)",
    background: "var(--bg-rooms-members)",
    padding: "2px",
    borderRadius: "2px",
  },
  {
    tag: tags.processingInstruction,
    color: "var(--fg-dim)",
  },
  { 
    tag: tags.url,
    color: "var(--color-link)",
  },
]);

onMount(() => {
  const startState = EditorState.create({
    doc: "hello *world* this is a **test** yes `hello`",
    extensions: [
      history(),
      syntaxHighlighting(highlight, { fallback: true }),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      closeBrackets(),
      EditorView.theme({
      //   ".cm-content": {color: "darkorange"},
      //   "&.cm-focused .cm-content": {color: "orange"}
        ".cm-content": { fontFamily: "var(--font-primary)" }
      }, { dark: true }),
      markdown(),
      EditorState.tabSize.of(4),
    ],
  });

  const view = new EditorView({
    state: startState,
    parent: editorEl,
  });

  Decoration.widget({ name: "foo" })
  
  // create a node
  // var htmlNode =document.createElement("h1");
  // var text =  document.createTextNode("Text or whatever");
  // htmlNode.appendChild(text)

  // call this after you initialized the editor.
  // the position must be like this {ch: YourCharecterNumber, line: YourLineNumber}  
  // view.addWidget({ch:30 , line: 1},htmlNode, true)
});
</script>
<style>
.editor {
  background: var(--mod-lighten);
  padding: 4px;
  white-space: pre-wrap;
}

/*
.editor :global(.dim) {
  color: var(--fg-muted);
}

.editor :global(.link) {
  color: var(--color-link);
}
*/
</style>
<div class="editor" bind:this={editorEl}></div>
<div style="min-height: 1em"></div>
<!--<Autocomplete type="user" selected={mention} options={users} />-->
