<script>
// merge with kick and deleterecent
import Popup from "../atoms/Popup.svelte";
import Textarea from "../atoms/Textarea.svelte";
import Dropdown from "../atoms/Dropdown.svelte";
import Button from "../atoms/Button.svelte";
export const confirm = ban;
export let current;
let reason;

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const placeholders = [
  "they hurt my feelings",
  "they broke bad",
];

const options = [];
if (current.room.type === "space") options.push(["This space", "space"]);
if (current.room.type === "room") {
  if (state.spaces.get("orphanRooms").find(i => i.roomId === current.room.roomId)) {
    options.push(["This room", "room"]);
  } else {
    options.push(["This space", "space"]);
    options.push(["Only this room", "room"]);
  }
}

function ban() {
  current.member.ban(reason && reason);
  state.popup.set({ ...current, id: null });
}
</script>
<style>
.title {
  margin: 8px 0;
}
</style>
<Popup>
  <h2 slot="header">Ban {current.member.name}?</h2>
  <div slot="content">
    {#if options.length > 1}
    <div class="title">Ban scope</div>
    <Dropdown {options} />
    {/if}
    <div class="title">Reason for ban</div>
    <Textarea autofocus placeholder={rnd(placeholders)} bind:value={reason} />
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind!" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label="Do it!" clicked={ban} />
  </div>
</Popup>
