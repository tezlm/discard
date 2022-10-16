<script>
// merge with ban and deleterecent
import Popup from "../atoms/Popup.svelte";
import Textarea from "../atoms/Textarea.svelte";
import Dropdown from "../atoms/Dropdown.svelte";
import Button from "../atoms/Button.svelte";
export const confirm = kick;
export let current;
let reason;

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const placeholders = [
  "they disagree with my opinion",
  "i dont like them",
];

const options = [];
if (current.room.type === "space") options.push(["This space", "space"]);
if (current.room.type === "room") {
  if (state.spaces.get("orphanRooms").find(i => i.id === current.room.id)) {
    options.push(["This room", "room"]);
  } else {
    options.push(["This space", "space"]);
    options.push(["Only this room", "room"]);
  }
}

function kick() {
  current.member.kick(reason && reason);
  state.popup.set({ ...current, id: null });
}
</script>
<style>
.title {
  margin: 8px 0;
}
</style>
<Popup>
  <h2 slot="header">Kick {current.member.name}?</h2>
  <div slot="content">
    {#if false && options.length > 1}
    <div class="title">Kick scope</div>
    <Dropdown {options} />
    {/if}
    <div class="title">Reason for Kick</div>
    <Textarea autofocus placeholder={rnd(placeholders)} bind:value={reason} />
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind!" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label="Do it!" clicked={kick} />
  </div>
</Popup>
