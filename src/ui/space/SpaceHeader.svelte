<script>
import Popup from "../atoms/Popup.svelte";
let focusedSpace = state.focusedSpace;
let showPopup = false;
</script>
<style>
.header {
  background: var(--bg-rooms-members);

  display: flex;
  align-items: center;
  padding: 8px 1rem;
  height: 48px;
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2),
    0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
  z-index: 1;
	font-weight: bold;
}
</style>
<div class="header" on:click={() => showPopup = true}>
  <span>{$focusedSpace ? state.client.getRoom($focusedSpace).name : "Home"}</span>
  <Popup bind:show={showPopup} title="todo">nothing here right now</Popup>
</div>
