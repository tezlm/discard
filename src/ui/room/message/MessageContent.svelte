<script>
import { sanitizeMatrixHtml } from "../../../util/sanitize.js";
import fileIcon from "../../../assets/file.svg";
export let event;
$: content = event.getContent();

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
}

.info {
  padding: 0 1em;
  display: flex;
  flex-direction: column;
}

.size {
  color: var(--fg-muted);
  font-size: .8rem;
}

.text {
  word-break: break-word;
}
</style>
{#if content.msgtype === "m.image"}
<img src={state.client.mxcUrlToHttp(content.url)} alt={content.body} />
{:else if content.msgtype=== "m.video"}
<video controls src={state.client.mxcUrlToHttp(content.url)} alt={content.body} />
{:else if content.msgtype=== "m.audio"}
<audio controls src={state.client.mxcUrlToHttp(content.url)} alt={content.body} />
{:else if content.msgtype=== "m.file"}
<div class="file">
  <img src={fileIcon} />
  <div class="info">
    <a href={state.client.mxcUrlToHttp(content.url)}>{content.body}</a><br />
    <span class="size">{formatSize(content.info?.size)}</span>
  </div>
</div>
{:else if content.format === "org.matrix.custom.html"}
<div class="text">{@html sanitizeMatrixHtml(content.formatted_body)}</div>
{:else}
<div class="text">{content.body}</div>
{/if}
