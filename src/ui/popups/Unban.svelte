<script>
// merge with ban and deleterecent
import Popup from "../atoms/Popup.svelte";
import Textarea from "../atoms/Textarea.svelte";
import Dropdown from "../atoms/Dropdown.svelte";
import Button from "../atoms/Button.svelte";
export const confirm = unban;
export let current;
let reason;

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const placeholders = [
  "they have matured and grown as a person",
  "i misclicked",
  "they were not the impostor",
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

function unban() {
  current.member.unban(reason && reason);
  state.popup.set({ ...current, id: null });
}
</script>
<style>
.title {
  margin: 8px 0;
}
</style>
<Popup>
  <h2 slot="header">Unban {current.member.name || current.member.id}?</h2>
  <div slot="content">
    {#if false && scopes.length > 1}
    <div class="title">Unban scope</div>
    <Dropdown options={scopes} />
    {/if}
    <div class="title">Reason for unban</div>
    <Textarea autofocus placeholder={rnd(placeholders)} bind:value={reason} />
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind!" on:click={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label="Do it!" on:click={unban} />
  </div>
</Popup>
