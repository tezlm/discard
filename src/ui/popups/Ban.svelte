<script>
import Popup from "../atoms/Popup.svelte";
import Textarea from "../atoms/Textarea.svelte";
import Dropdown from "../atoms/Dropdown.svelte";
import Button from "../atoms/Button.svelte";
export const confirm = todo;
export let current;

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
</script>
<style>
.title {
  margin: 8px 0;
}
</style>
<Popup>
  <h2 slot="header">Ban {current.member.name}?</h2>
  <div slot="content">
    {#if options.length}
    <div class="title">Ban scope</div>
    <Dropdown {options} />
    {/if}
    <div class="title">Reason for ban</div>
    <Textarea />
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind!" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label="Do it!" clicked={todo} />
  </div>
</Popup>
