<script>
import { parseHtml } from "../../../util/html.js";
import { parseMxc } from "../../../util/content.js";
import { highlightAllUnder } from "prismjs";
import File from "../../molecules/files/File.svelte";
import Audio from "../../molecules/files/Audio.svelte";
import Video from "../../molecules/files/Video.svelte";
export let event;
let wrapper;

// TODO: make emoji only messages bigger

$: content = event.content;
$: type = content.msgtype;
$: edited = event.original;
$: special = event.special;
$: dimensions = parseDimensions(content.info?.thumbnail_info ?? content.info);

function parseDimensions(info) {
  if (!info || !info.w || !info.h) return { width: 400, height: 300, css: `max-width: 400px; height: 300px; object-fit: cover` };
  let width = info.w, height = info.h;
  if (width > 400) {
    const scale = 400 / width;
    width *= scale;
    height *= scale;
  }
  if (height > 300) {
    const scale = 300 / height;
    width *= scale;
    height *= scale;
  }
  width = Math.floor(width);
  height = Math.floor(height);
  return { width, height, css: `width: ${width}px; height: ${height}px` };
}

function formatSize(size) {
  if (!size) return "??? kb";
  let max = 1024;
  for (let unit of ["bytes", "KiB", "MiB", "GiB", "TiB"]) {
    if (size < max) return `${Math.floor(size / (max / 1024))} ${unit}`;
    max *= 1024;
  }
  return "very big";
}

$: if (wrapper) {
  highlightAllUnder(wrapper);
}
</script>
<style>
.sending {
  color: var(--fg-muted);
}

.edited {
  font-size: .625rem;
  color: var(--fg-muted);
  margin-left: 2px;
}

.redacted {
  color: var(--color-red);
}

.redacted *:not(.text) {
  filter: grayscale(100%);
  transition: filter 50ms;
}

.redacted:hover * {
  filter: grayscale(0);
}

.emote {
  font-style: italic;
}

img, audio {
  display: block;
  border-radius: 3px;
  background: var(--bg-rooms-members);
  margin: 4px 0;
}

img {
  cursor: pointer;
}

.text {
  display: inline;
  word-break: break-word;
  user-select: text;
}

.text :global(*) {
  white-space: pre-wrap;
}

.text :global(pre) {
  max-width: 90%;
}

.text :global(blockquote), .text :global(ol), .text :global(ul) {
  white-space: normal;
}

.text :global([data-mx-ping]) {
  color: var(--fg-notice);
  font-weight: 500;
  background: var(--ping-bgalpha);
  padding: 0 2px;
  border-radius: 3px;
  cursor: pointer;
}

.text :global([data-mx-emoticon]) {
  height: calc(1em);
  margin-bottom: -2px;
}

.text :global([data-mx-ping]):hover {
  background: var(--ping-bg);
}
</style>
<div
  class:redacted={special === "redacted" || special === "errored"}
  class:sending={special === "sending"}
  style={type === "m.image" || type === "m.video" ? dimensions.css : ""}
  bind:this={wrapper}
>
  {#if type === "m.image"}
  <img
    src={parseMxc(content.url, dimensions.width, dimensions.height)}
    alt={content.body}
    style={dimensions.css}
    on:click={() => state.popup.set({ id: "attachment", url: parseMxc(content.url) + "/" + (content.filename ?? content.body) })}
  />
  {:else if type === "m.video"}
  <Video src={parseMxc(content.url)} name={content.filename ?? content.body} size={content.info?.size} />
  {:else if type === "m.audio"}
  <Audio src={parseMxc(content.url)} name={content.filename ?? content.body} size={content.info?.size} />
  {:else if type === "m.file"}
  <File src={parseMxc(content.url)} name={content.filename ?? content.body} size={content.info?.size} />
  {:else if content.format === "org.matrix.custom.html"}
  <div class="text" class:emote={type === "m.emote"}>
    {#if type === "m.emote"}*{/if}
    {@html parseHtml(content.formatted_body.trim()).trim()}
    {#if edited}
    <span class="edited">(edited)</span>
    {/if}
  </div>
  {:else if content.body}
  <div class="text" class:emote={type === "m.emote"}>
    {#if type === "m.emote"}*{/if}
    {@html parseHtml(content.body.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;"), { linkify: true })}
    {#if edited}
    <span class="edited">(edited)</span>
    {/if}
  </div>
  {/if}
</div>
