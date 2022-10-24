<script>
// merge with ban and kick?
import Popup from "../atoms/Popup.svelte";
import Textarea from "../atoms/Textarea.svelte";
import Dropdown from "../atoms/Dropdown.svelte";
import Button from "../atoms/Button.svelte";
export const confirm = todo;
export let current;

$: name = current.member.name ?? current.member.id;

const scopes = [];
if (current.room.type === "m.space") {
  scopes.push(["This space", "space"]);
} else if (state.spaces.get("orphanRooms").find(i => i.id === current.room.id)) {
  scopes.push(["This room", "room"]);
} else {
  scopes.push(["This space", "space"]);
  scopes.push(["Only this room", "room"]);
}

const since = [
  ["Previous 24 hours", "24h"],
  ["Previous 12 hours", "12h"],
  ["Previous 6 hours", "6h"],
  ["Previous hour", "1h"],
  ["Don't delete any", "what"],
];

let selected = "1h";
</script>
<style>
.title {
  margin: 8px 0;
}
</style>
<Popup>
  <h2 slot="header">Remove {name}'{name[name.length - 1] === "s" ? "" : "s"} messages?</h2>
  <div slot="content">
    {#if scopes.length}
    <div class="title">Delete scope</div>
    <Dropdown options={scopes} />
    {/if}
    <div class="title">Delete everything from the</div>
    <Dropdown options={since} bind:selected={selected} />
    <div class="title">Reason for deletion</div>
    <Textarea placeholder="they disagree with my opinion" />
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind!" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button type="danger" label={selected === "what" ? "????" : "Do it!"} clicked={() => selected === "what" ? window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ") : todo()} />
  </div>
</Popup>
