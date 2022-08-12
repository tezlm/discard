<script>
import Button from "../atoms/Button.svelte";
import Input from "../atoms/Input.svelte";
import Popup from "../atoms/Popup.svelte";
export const confirm = create;
export let current;
let name = "";
let creating = false;

function capitalize(str) {
  if (!str?.length) return str;
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

async function create() {
  creating = true;
  const parentId = current.parent?.roomId;
  const { room_id } = await state.api.createRoom({
    name,
    creator: state.userId,
    ...(current.type === "space" && { type: "m.space" }),
    ...(parentId && {
      state: [
        { content: { canonical: true }, type: "m.space.parent", state_key: parentId },
        { content: { join_rule: "restricted", allow: [{ room_id: parentId, type: "m.room_membership" }] }, type: "m.room.join_rules" },
      ],
    }),
  });

  if (parentId) {
    state.api.sendState(parentId, "m.space.child", room_id, { auto_join: false, suggested: false, via: [room_id.match(/:.+/)[0].slice(1)] });  
  }

  const interval = setInterval(() => {
    if (!state.rooms.has(room_id)) return;
    if (current.type === "space") {
      actions.spaces.focus(state.rooms.get(room_id));
    } else {
      actions._rooms.focus(state.rooms.get(room_id));  
    }
    state.popup.set({ type: current.type });
    clearInterval(interval);
  }, 10);
}
</script>
<style>
.close {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 28px;
  font-weight: normal;
  color: var(--fg-muted);
  cursor: pointer;
  transition: color 0.4s;
}
</style>
<Popup>
  <h3 slot="header">Create {capitalize(current.type)} <div class="close icon" on:click={() => state.popup.set({ ...current, id: null })}>close</div></h3>
  <div slot="content" style="display: flex; flex-direction: column">
    <span class="title">{capitalize(current.type)} Name</span>
    <Input placeholder="awesome-{current.type}" bind:value={name} submitted={create} autofocus />
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button
      type="primary"
      disabled={!name.length}
      loading={creating}
      label={creating ? `Creating ${capitalize(current.type)}...` : `Create ${capitalize(current.type)}`}
      clicked={create}
    />
  </div>
</Popup>

