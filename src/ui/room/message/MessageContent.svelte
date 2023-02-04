<script>
import hljs from "highlight.js";
import File from "../../molecules/files/File.svelte";
import Audio from "../../molecules/files/Audio.svelte";
import Video from "../../molecules/files/Video.svelte";
import Text from "../../molecules/files/Text.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";
import { parseHtml } from "../../../util/html";
import { parseMxc } from "../../../util/content";
import { fastclick } from "../../../util/use";
export let event;
let wrapper;
let { popup } = state;

// TODO: make emoji only messages bigger

$: content = event.content;
$: type = content.msgtype ?? event.type;
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

function handleImgClick(e) {
  const tg = e.explicitOriginalTarget;
  if (tg.tagName !== "IMG") return;
  $popup = {
    id: "attachment",
    url: tg.src,
    alt: tg.alt ?? `An image with the id ${tg.src.split("/").at(-1)}`,
  };
}

$: if (wrapper) {
  for (let el of wrapper.querySelectorAll("code[class^=language-]")) { 
    hljs.highlightElement(el);
  }
}
</script>
<style>
.content {
  max-width: 100%;
}

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

img {
  display: block;
  border-radius: 3px;
  /* background: var(--bg-rooms-members); */
  margin: 2px 0;
}

img {
  cursor: pointer;
}

.text {
  display: inline;
  word-break: break-word;
}

.text :global(*) {
  white-space: pre-wrap;
}

.text :global(pre) {
  max-width: 90%;
}

.text :global(blockquote), .text :global(ol), .text :global(ul), .text :global(li), .text :global(details) {
  white-space: normal;
}

:global(blockquote + blockquote) {
  margin-top: 4px;
}

.text :global(img) {
  max-height: 300px;
  max-width: 400px;
  cursor: pointer;
}
</style>
<div
  class="content"
  class:redacted={event.flags?.has("redacted") || event.flags?.has("errored")}
  class:sending={event.flags?.has("sending")}
  style={type === "m.image" || type === "m.video" ? dimensions.css : ""}
  bind:this={wrapper}
>
  {#if type === "m.image"}
  {@const name = content.filename}
  <img
    src={parseMxc(content.url, dimensions.width, dimensions.height)}
    alt={name}
    title={name}
    style={dimensions.css}
    use:fastclick 
    on:fastclick={() => $popup = { id: "attachment", url: parseMxc(content.url) + (name ? "/" + name : ""), alt: name }}
  />
  {:else if type === "m.sticker"}
  <!-- note that this will fetch the full res sticker, which might not be ideal -->
  {@const name = content.filename}
  <img
    src={parseMxc(content.url)}
    alt={name}
    title={name}
    style="height: 128px"
    use:fastclick 
    on:fastclick={() => $popup = { id: "attachment", url: parseMxc(content.url) + (name ? "/" + name : ""), alt: name }}
  />
  {:else if type === "m.video"}
  <Video src={parseMxc(content.url)} name={content.filename ?? content.body} info={content.info} />
  {:else if type === "m.audio"}
  <div style="display: inline-block">
    <Audio src={parseMxc(content.url)} name={content.filename ?? content.body} info={content.info} />
  </div>
  {:else if type === "m.file"}
  {@const mime = content.info?.mimetype}
  <div style="display: inline-block">
    <File src={parseMxc(content.url)} name={content.filename ?? content.body} info={content.info} />
    <!--
    {#if (/text\//.test(mime) || mime === "application/json" || mime === "application/x-javascript") && content.info.size < 1024 * 1024}
      <Text src={parseMxc(content.url)} size={content.info?.size ?? null} name={content.filename ?? content.body} {mime} />
    {:else}
      <File src={parseMxc(content.url)} size={content.info?.size ?? null} name={content.filename ?? content.body} />
    {/if}
    -->
  </div>
  {:else}
    {@const emote = type === "m.emote"}
    {#if content.format === "org.matrix.custom.html"}
    <div class="text" class:emote use:fastclick={{ stop: false }} on:fastclick={handleImgClick}>{#if emote}*{/if}{@html parseHtml(content.formatted_body?.trim() || content.body.trim()).trim()}</div>
    {:else if content.body}
    <div class="text" class:emote>{#if emote}*{/if}{@html parseHtml(content.body.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\n/g, "<br />"))}</div>
    {:else}
    <div class="text"><i style:color="var(--fg-dim)">no content</i></div>
    {/if}
  {/if}
  {#if event.flags?.has("edited")}
  {@const replace = event.relationsIn.find(i => i.relType === "m.replace").event}
  <Tooltip tip="Edited at {replace.timestamp.toLocaleString()}">
    <span class="edited" style="cursor: default">(edited)</span>
  </Tooltip>
  {/if}
</div>
