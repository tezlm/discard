<script>
import { sanitizeMatrixHtml } from "../../../util/sanitize.js";
export let event;
let content = event.getContent();
</script>
<style>
img, video {
  display: block;
  max-height: 30vh;
  max-width: 400px;
  border-radius: 3px;
}
</style>
{#if content.msgtype === "m.image"}
<img src={state.client.mxcUrlToHttp(content.url)} alt={content.body} />
{:else if content.msgtype=== "m.video"}
<video controls src={state.client.mxcUrlToHttp(content.url)} alt={content.body} />
{:else if content.format === "org.matrix.custom.html"}
<div>{@html sanitizeMatrixHtml(content.formatted_body)}</div>
{:else}
<div>{content.body}</div>
{/if}
