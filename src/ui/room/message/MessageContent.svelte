<script>
import { parseHtml } from "../../../util/html.js";
import fileIcon from "../../../assets/file.svg";
export let event;

let client = { mxcUrlToHttp: h => h.replace(/mxc:\/\/([^/]+)\/(.+)/, `https://celery.eu.org/_matrix/media/r0/download/$1/$2`) }; // TODO: not hardcode this

$: content = event.content;
$: type = content.msgtype;
$: edited = event.original;
$: redacted = event.redacted;
$: sending = event.isSending;
$: dimensions = parseDimensions(content.info?.thumbnail_info ?? content.info);

function parseDimensions(info) {
  if (!info || !info.w || !info.h) return `max-width: 400px; height: 300px; object-fit: cover`;
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
  return `width: ${width}px; height: ${height}px`;
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

img, video, audio {
  display: block;
  border-radius: 3px;
  background: var(--bg-rooms-members);
  margin: 4px 0;
}

img {
  cursor: pointer;
}

.file {
  background: var(--bg-rooms-members);
  border: solid var(--bg-spaces) 1px;
  border-radius: 3px;
  display: flex;
  padding: .5rem;
  height: 60px;
  width: fit-content;
}

.file > .info {
  padding: 0 1em;
  display: flex;
  flex-direction: column;
}

.file > .info > .size {
  color: var(--fg-muted);
  font-size: .8rem;
}

.text {
  display: inline-block;
  width: 100%;
  word-break: break-word;
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

.text :global([data-mx-ping]):hover {
  background: var(--ping-bg);
}
</style>
<div class:redacted class:sending style={type === "m.image" || type === "m.video" ? dimensions : ""}>
  {#if type === "m.image"}
  <img src={client.mxcUrlToHttp(content.url) + "/" + content.body} alt={content.body} style={dimensions} on:click={() => state.popup.set({ id: "attachment", url: client.mxcUrlToHttp(content.url) + "/" + content.body })} />
  {:else if type === "m.video"}
  <video controls src={client.mxcUrlToHttp(content.url)} alt={content.body} style={dimensions} />
  {:else if type === "m.audio"}
  <audio controls src={client.mxcUrlToHttp(content.url)} alt={content.body} />
  {:else if type === "m.file"}
  <div class="file">
    <img src={fileIcon} alt="file icon" />
    <div class="info">
      <a href={client.mxcUrlToHttp(content.url)}>{content.body}</a><br />
      <span class="size">{formatSize(content.info?.size)}</span>
    </div>
  </div>
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
