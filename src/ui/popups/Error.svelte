<script>
import Popup from "../atoms/Popup.svelte";
export let current;

// and as always
// TODO: show this popup with helpful details on error

function closePopup() {
  state.popup.set({ ...current, id: null });
}
</script>
<Popup>
  <h2 slot="header">oh no</h2>
  <p slot="content">it broke</p>
</Popup>
