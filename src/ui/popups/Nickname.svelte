<script>
// currently UNUSED: will be implemented later
import Button from "../atoms/Button.svelte";
import Input from "../atoms/Input.svelte";
import Popup from "../atoms/Popup.svelte";
export let current;

function closePopup() {
  // state.popup.set({ ...$current, id: null });
  state.popup.set({ id: null });
}
</script>
<Popup>
  <h2 slot="header">Change Nickname</h2>
  <div slot="content">
    <span class="title">Nickname<br><br></span>
    <Input optional />
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" on:click={closePopup} />
    <Button type="primary" label="Save" on:click={() => state.popup.set({ id: "todo" })} />
  </div>
</Popup>
