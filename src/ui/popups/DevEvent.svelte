<script type="ts">
import Popup from "../atoms/Popup.svelte";
import Button from "../atoms/Button.svelte";
import hljs from "highlight.js";
export let current;

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

console.log(current.event);
</script>
<style>
pre {
  max-width: 600px;
  overflow-y: auto;
  max-height: 50vh;
}
</style>
<Popup showClose>
  <h3 slot="header">View source</h3>
  <div slot="content">
    {#if current.event.flags.size}
      <div>discard flags: {[...current.event.flags].join(", ")}</div>
      <br />
    {/if}
    <pre><code>{@html hljs.highlight("json", JSON.stringify(current.event.raw, null, 4)).value}</code></pre>
  </div>
  <div slot="footer">
    <Button label="copy event id" type="primary" clicked={() => copy(current.event.id)} />
    <Button label="copy room id"  type="primary" clicked={() => copy(current.event.room.id)} />
  </div>
</Popup>
