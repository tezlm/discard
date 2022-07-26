<script>
import Popup from "../atoms/Popup.svelte";
export let current;

function closePopup() {
  state.popup.set({ ...current, id: null });
}
</script>
<Popup>
  <h2 slot="header">todo <div class="close icon" on:click={closePopup}>close</div></h2>
  <p slot="content">nice, you found a todo popup</p>
</Popup>
