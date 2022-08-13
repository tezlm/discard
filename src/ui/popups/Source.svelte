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
    <p>note: this is discard's internal event representation, and not matrix's. <a class="copy" on:click={copyId}>copy id</a></p><br />
    <pre><code>{@html highlight(JSON.stringify(current.event, null, 4), Prism.languages.js, "json")}</code></pre>
  </div>
</Popup>
