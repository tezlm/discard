<script>
import Popup from "../atoms/Popup.svelte";
import RoomTextarea from "../room/input/RoomTextarea.svelte";
import Button from "../atoms/Button.svelte";
import Video from "../molecules/files/Video.svelte";
import Audio from "../molecules/files/Audio.svelte";
import { formatSize } from "../../util/format.ts";
import hljs from "highlight.js";
export let current;
export const confirm = current.confirm;
let type = current.file.type.split("/")[0];

function closePopup() {
  state.popup.set({ ...current, id: null });
}

async function getText(file) {
  const text = await file.text();
  const trim = text.split("\n").slice(0, 12).join("\n");
  const lang = file.type?.split("/")[1];
  return hljs.highlight(hljs.getLanguage(lang) ? lang : "text", trim).value; 
}
</script>
<style>
.content {
  max-width: 440px;
  max-height: 440px;
}

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

.input {
  display: flex;
  min-height: 44px;
  border-radius: 8px;
  padding: 0 8px;
  margin-top: 8px;
  background: #40444b;
}
</style>
<Popup>
  <h2 slot="header">Upload file</h2>
  <div slot="content" style="max-width: 440px">
    <div class="info">
      do you want to upload {current.file.name || "this file"}?
      <span class="size">({formatSize(current.file.size)})</span>
    </div>
    <div class="content">
      {#if type === "image"}
      <img src={URL.createObjectURL(current.file)} alt={current.file.name} />
      {:else if type === "video"}
      <Video src={URL.createObjectURL(current.file)} name={current.file.name} size={current.file.size} />
      {:else if type === "audio"}
      <Audio src={URL.createObjectURL(current.file)} name={current.file.name} size={current.file.size} />
      {:else if type === "text" || current.file.type === "application/json"}
      <pre>{#await getText(current.file) then text}{@html text}{/await}</pre>
      {/if}
    </div>
    <!--
    <div class="title" style="margin-top: 16px">
    Add a comment
    </div>
    <div class="input">
      <RoomTextarea placeholder="Add a comment..." />
    </div>
    -->
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind" clicked={closePopup} />
    <Button type="primary" label="Upload!" clicked={() => { current.confirm(); closePopup() }} />
  </div>
</Popup>

