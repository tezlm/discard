<script>
import { parseHtml } from "../../../util/html.js";
import { parseMxc } from "../../../util/content.ts";
import hljs from "highlight.js";
import Button from "../../atoms/Button.svelte";
import File from "../../molecules/files/File.svelte";
import Audio from "../../molecules/files/Audio.svelte";
import Video from "../../molecules/files/Video.svelte";
import Text from "../../molecules/files/Text.svelte";
export let event;
let wrapper;

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

$: if (wrapper) {
  for (let el of wrapper.querySelectorAll("code[class^=language-]")) { 
    hljs.highlightBlock(el);
  }
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

img {
  display: block;
  border-radius: 3px;
  /* background: var(--bg-rooms-members); */
  margin: 4px 0;
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

.text :global([data-mx-ping]) {
  position: relative;
  color: var(--color-accent);
  font-weight: 500;
  padding: 0 2px;
  cursor: pointer;
}

.text :global([data-mx-ping]::after) {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  background: var(--color-accent);
  opacity: .1;
}

.text :global([data-mx-ping="room"]) {
  color: var(--color-purple);
}

.text :global([data-mx-ping="room"]::after) {
  background: var(--color-purple);
}

.text :global([data-mx-ping]:hover::after) {
  opacity: .2;
}

.text :global([data-mx-emoticon]) {
  height: calc(1em);
  margin-bottom: -2px;
}

.sticker-popout {
  position: absolute;
  left: 128px;
  top: 24px;

  display: inline-flex;
  width: 300px;
  padding: 16px;
  background: var(--bg-context);
  border-radius: 8px;
  box-shadow: var(--shadow-popup);
}

.sticker-popout > img {
  margin-right: 16px;
}

.sticker-popout > div {
  display: flex;
  flex-direction: column;
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
  <img
    src={parseMxc(content.url, dimensions.width, dimensions.height)}
    alt={content.body}
    title={content.body}
    style={dimensions.css}
    on:click={() => state.popup.set({ id: "attachment", url: parseMxc(content.url) + "/" + (content.filename ?? content.body) })}
  />
  {:else if type === "m.sticker"}
  <!-- note that this will fetch the full res sticker, which might not be ideal -->
  <img
    src={parseMxc(content.url)}
    alt={content.body}
    title={content.body}
    style="height: 128px"
    on:click={() => state.popup.set({ id: "attachment", url: parseMxc(content.url) + "/" + (content.filename ?? content.body) })}
  />
  <!--
  <div class="sticker-popout">
    <img
      src={parseMxc(content.url, dimensions.width, dimensions.height)}
      alt={content.body}
      title={content.body}
      style={dimensions.css}
      on:click={() => state.popup.set({ id: "attachment", url: parseMxc(content.url) + "/" + (content.filename ?? content.body) })}
    />
    <div>
      <b>{content.body}</b>
      <span>maybe some additional metadata or info can be here...</span>
      <div style="height:16px"></div>
      <Button label="steal" type="primary" clicked={todo} />
    </div>
  </div>
  -->
  {:else if type === "m.video"}
  <Video src={parseMxc(content.url)} name={content.filename ?? content.body} size={content.info?.size} />
  {:else if type === "m.audio"}
  <div style="display: inline-block">
    <Audio src={parseMxc(content.url)} name={content.filename ?? content.body} size={content.info?.size} />
  </div>
  {:else if type === "m.file"}
  {@const mime = content.info?.mimetype}
  <div style="display: inline-block">
    {#if /text\//.test(mime) || mime === "application/json"  || mime === "application/x-javascript"}
      <Text src={parseMxc(content.url)} size={content.info?.size ?? null} name={content.filename ?? content.body} />
    {:else}
      <File src={parseMxc(content.url)} size={content.info?.size ?? null} name={content.filename ?? content.body} {mime} />
    {/if}
  </div>
  {:else if content.format === "org.matrix.custom.html"}
  <div class="text" class:emote={type === "m.emote"}>
    {#if type === "m.emote"}*{/if}
    {@html parseHtml(content.formatted_body.trim()).trim()}
    {#if event.flags?.has("edited")}
    <span class="edited">(edited)</span>
    {/if}
  </div>
  {:else if content.body}
  <div class="text" class:emote={type === "m.emote"}>
    {#if type === "m.emote"}*{/if}
    {@html parseHtml(content.body.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\n/g, "<br />"), { linkify: true })}
    {#if event.flags?.has("edited")}
    <span class="edited">(edited)</span>
    {/if}
  </div>
  {/if}
</div>
