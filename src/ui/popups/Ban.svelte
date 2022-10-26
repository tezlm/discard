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
  "they were the impostor among us",
  "goofy ahh telegram scam",
];

const scopes = [];
if (current.room.type === "m.space") {
  scopes.push(["This space", "space"]);
} else if (state.spaces.get("orphanRooms").find(i => i.id === current.room.id)) {
  scopes.push(["This room", "room"]);
} else {
  scopes.push(["This space", "space"]);
  scopes.push(["Only this room", "room"]);
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
  <h2 slot="header">Ban {current.member.name || current.member.id}?</h2>
  <div slot="content">
    {#if scopes.length > 1}
    <div class="title">Ban scope</div>
    <Dropdown options={scopes} />
    {/if}
    <div class="title">Reason for ban</div>
    <Textarea autofocus placeholder={rnd(placeholders)} bind:value={reason} />
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind!" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label="Do it!" clicked={ban} />
  </div>
</Popup>
