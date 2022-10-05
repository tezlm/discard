<script>
import Popup from "../atoms/Popup.svelte";
import hljs from "highlight.js";
export let current;

function copyId() {
  navigator.clipboard.writeText(current.event.eventId);
}

console.log(current.event);
</script>
<style>
.copy {
  cursor: pointer;
}

pre {
  max-width: 600px;
  overflow-y: auto;
  max-height: 50vh;
}
</style>
<Popup showClose>
  <h3 slot="header">View source</h3>
  <div slot="content">
    <a class="copy" on:click|preventDefault={copyId}>copy event id</a>
    {#if current.event.flags.size}
      <div>discard flags: {[...current.event.flags].join(", ")}</div>
    {/if}
    <br />
    <pre><code>{@html hljs.highlight("json", JSON.stringify(current.event.raw, null, 4)).value}</code></pre>
  </div>
</Popup>
