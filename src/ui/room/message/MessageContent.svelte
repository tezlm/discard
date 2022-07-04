<script>
import { sanitizeMatrixHtml } from "../../../util/sanitize.js";
import fileIcon from "../../../assets/file.svg";
export let event;
let client = state.client;

$: content = event.content;
$: type = content.msgtype;
$: edited = event.original;
$: redacted = event.redacted;
$: sending = event.sending;
$: dimensions = { width: content.info?.w, height: content.info?.h };

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
img, video, audio {
  display: block;
  max-height: 30vh;
  max-width: 400px;
  border-radius: 3px;
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
  word-break: break-word;
  width: 100%;
}

.text :global(pre) {
  margin-top: 6px;
  padding: 7px;
  max-width: 90%;

  border: solid var(--bg-spaces) 1px;
  border-radius: 4px;
  font: 14px/1.125rem var(--font-monospace);
  background: var(--bg-rooms-members);
  color: var(--fg-light);
}

.text :global(code) {
  background: var(--bg-rooms-members);
  padding: 2px 2px;
  font: 14px/1.125rem var(--font-monospace);
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
</style>
<!-- <div class:redacted class:sending style:width={dimensions.width + "px"} style:height={dimensions.height + "px"}> -->
<div class:redacted class:sending>
  {#if type === "m.image"}
  <img src={client.mxcUrlToHttp(content.url)} alt={content.body} />
  {:else if type === "m.video"}
  <video controls src={client.mxcUrlToHttp(content.url)} alt={content.body} />
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
  <div class="text">
    {@html sanitizeMatrixHtml(content.formatted_body)}
    {#if edited}
    <span class="edited">(edited)</span>
    {/if}
  </div>
  {:else}
  <div class="text">
    {content.body}
    {#if edited}
    <span class="edited">(edited)</span>
    {/if}
  </div>
  {/if}
</div>
