<script>
import hljs from "highlight.js";
import { formatSize } from "../../../util/format";
export let src;
export let name = "title";
export let size = 0;
export let mime = "text/plain";

// FIXME: jumps around when expanding
// TODO: implement this

let expand = false;

async function fetchFile() {
  const req = await fetch(src);
  const text = await req.text();
  return text.split("\n").slice(0, 100).join("\n");
}

function getType(mime) {
  return mime?.split("/")[1].split(";")[0].replace(/^x-/, "");
}

function getLang(mime) {
  const lang = getType(mime);
  return hljs.getLanguage(lang) ? lang : "text";
}
</script>
<style>
.code {
  border: solid var(--bg-misc) 1px;
  border-radius: 4px;
  font: 14px/1.125rem var(--font-monospace);
  background: var(--bg-rooms-members);
  color: var(--fg-light);
}

pre {
  height: 117px;
  margin: 0;
  border: none;
}

pre.expand {
  height: auto;
}

.info {
  display: flex;
  padding: 7px;
  border-top: solid var(--bg-misc) 1px;
}
</style>
<div class="code">
  <pre class:expand>{#await fetchFile() then file}<code>{@html hljs.highlight(getLang(mime), file).value}</code>{/await}</pre>
  <div class="info">
    <div on:click={() => expand = !expand} style="cursor: pointer">{expand ? "collapse" : "expand"}</div>
    <div style="flex: 1"></div>
    <div>{name} {formatSize(size)} <a href={src}>download</a></div>
  </div>
</div>
