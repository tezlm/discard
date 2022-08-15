<script>
import Popup from "../atoms/Popup.svelte";
import { highlight } from "prismjs";
export let current;

function closePopup() {
  state.popup.set({ ...current, id: null });
}

function copyId(e) {
  e.preventDefault();
  navigator.clipboard.writeText(current.event.eventId);
}

console.log(current.event)
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
<Popup>
  <h3 slot="header">View source <div class="close icon" on:click={closePopup}>close</div></h3>
  <div slot="content">
    {#if current.event.flags.size}
      <p>discard message flags: {[...current.event.flags].join(", ")}</p>
      <br />
    {/if}
    <pre><code>{@html highlight(JSON.stringify(current.event.raw, null, 4), Prism.languages.js, "json")}</code></pre>
  </div>
</Popup>
