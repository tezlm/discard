<script>
// merge with ban and deleterecent
import Popup from "../atoms/Popup.svelte";
import Textarea from "../atoms/Textarea.svelte";
import Dropdown from "../atoms/Dropdown.svelte";
import Button from "../atoms/Button.svelte";
export const confirm = kick;
export let current;
let reason;

const placeholders = [
  "they disagree with my opinion",
  "i dont like them",
  "they were acting sussy",
];

function getPlaceholder() {
  return placeholders[Math.floor(Math.random() * placeholders.length)];
}

const scopes = [];
if (current.room.type === "m.space") {
  scopes.push(["This space", "space"]);
} else if (state.spaces.get("orphanRooms").find(i => i.id === current.room.id)) {
  scopes.push(["This room", "room"]);
} else {
  scopes.push(["This space", "space"]);
  scopes.push(["Only this room", "room"]);
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
  <h2 slot="header">Kick {current.member.name || current.member.id}?</h2>
  <div slot="content">
    {#if scopes.length > 1}
    <div class="title">Kick scope</div>
    <Dropdown options={scopes} />
    {/if}
    <div class="title">Reason for Kick</div>
    <Textarea autofocus placeholder={getPlaceholder()} bind:value={reason} />
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind!" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label="Do it!" clicked={kick} />
  </div>
</Popup>
