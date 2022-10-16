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
  "i got free wifi anywhere i went",
  "they really *are* a nigerian prince",
  "i misclicked",
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
  <h2 slot="header">Unban {current.member.name}?</h2>
  <div slot="content">
    {#if false && options.length > 1}
    <div class="title">Unban scope</div>
    <Dropdown {options} />
    {/if}
    <div class="title">Reason for unban</div>
    <Textarea autofocus placeholder={rnd(placeholders)} bind:value={reason} />
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind!" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label="Do it!" clicked={unban} />
  </div>
</Popup>
