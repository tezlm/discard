<script>
import Popup from "../atoms/Popup.svelte";
import Button from "../atoms/Button.svelte";
import { formatSize } from "../../util/format.js";
export let current;
export const confirm = current.confirm;

function closePopup() {
  state.popup.set({ ...current, id: null });
}
</script>
<style>
.info {
  margin-bottom: 1em;
  margin-top: -8px;
}

.size {
  color: var(--fg-muted);
}

img {
  display: block;
  margin: 0 auto;
  max-width: 440px;
  max-height: 400px;
  object-fit: cover;
  border-radius: 3px;
}
</style>
<Popup>
  <h2 slot="header">Upload file</h2>
  <div slot="content">
    <div class="info">
      do you want to upload {current.file.name || "this file"}?
      <span class="size">({formatSize(current.file.size)})</span>
    </div>
    {#if current.file.type.startsWith("image")}
    <img src={URL.createObjectURL(current.file)} alt={current.file.name} />
    {/if}
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind" clicked={closePopup} />
    <Button type="primary" label="Upload!" clicked={() => { current.confirm(); closePopup() }} />
  </div>
</Popup>

