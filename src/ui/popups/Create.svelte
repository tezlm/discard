<script>
import Button from "../atoms/Button.svelte";
import Input from "../atoms/Input.svelte";
import Textarea from "../atoms/Textarea.svelte";
import Popup from "../atoms/Popup.svelte";

import Toggle from "../atoms/Toggle.svelte";
import Dropdown from "../atoms/Dropdown.svelte";
import IdInput from "../atoms/IdInput.svelte";
import AvatarUpload from "../atoms/AvatarUpload.svelte";

export const confirm = create;
export let current;
let config = {
  name: "",
  topic: null,
  joinRule: "invite",
  noFederate: false,
};

let joinRules = [
  ["Private (Invite only)", "invite"],
  ...(current.parent ? [["Restricted (Space members can join)", "restricted"]] : []),
  ["Public (Anyone can join)", "public"],
];

let creating = false;

function capitalize(str) {
  if (!str?.length) return str;
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

async function create() {
  creating = true;
  const { parent } = current;
  const initialState = [], creationContent = {};
  
  if (config.avatar?.file) {
    const url = await state.api.uploadFile(config.avatar.file).promise;
    initialState.push({ content: { url }, type: "m.room.avatar" });
  }
  
  if (config.joinRule !== "restricted") {
    initialState.push({ content: { join_rule: config.joinRule }, type: "m.room.join_rules" });
  }
  
  if (parent) {
    initialState.push({ content: { canonical: true }, type: "m.space.parent", state_key: parent.id });
    if (config.joinRule === "restricted") {
      initialState.push({ content: { join_rule: "restricted", allow: [{ room_id: parent.id, type: "m.room_membership" }] }, type: "m.room.join_rules" });
    }
  }
  
  if (config.noFederate) {
    creationContent["m.federate"] = false;
  }
  
  if (current.type === "space") {
    creationContent.type = "m.space";
  }
  
  const { room_id } = await state.api.createRoom({
    name: config.name,
    topic: config.topic,
    creator: state.userId,
    state: initialState,
    creationContent,
  });

  if (parent) {
    parent.sendState("m.space.child", { suggested: false, via: [room_id.match(/:.+/)[0].slice(1)] }, room_id);
  }

  const interval = setInterval(() => {
    if (!state.rooms.has(room_id)) return;
    if (current.type === "space") {
      if (!current.parent) {
        actions.to(`/space/${room_id}`);
      }
    } else {
      actions.to(`/room/${room_id}`);
    }
    state.popup.set({ type: current.type });
    clearInterval(interval);
  }, 10);
}
</script>
<style>
</style>
<Popup showClose>
  <h3 slot="header">Create {capitalize(current.type)}</h3>
  <div slot="content" style="display: flex; flex-direction: column;">
    <div style="display: flex;">
      <div style="flex: 1; margin-right: 24px">
        <h3 class="title">{capitalize(current.type)} Name</h3>
        <Input placeholder="awesome-{current.type}" bind:value={config.name} submitted={create} autofocus />
      </div>
      <div style="margin-bottom: -32px">
        <AvatarUpload user={{ id: Date.now().toString() }} bind:newData={config.avatar} size={64} />
      </div>
    </div>
    <h3 class="title" style="margin-top: 1em">{capitalize(current.type)} Topic </h3>
    <Textarea placeholder="optional topic for your {current.type}" bind:value={config.topic} />
    <h3 class="title" style="margin-top: 1em">Room visibility</h3>
    <Dropdown options={joinRules} bind:selected={config.joinRule} />
    {#if current.type !== "space" && config.joinRule !== "public"}
    <div class="warning" style="margin-top: 1em; margin-bottom: -4px;">end to end encryption is not implemented yet</div>
    <div style="display:flex; margin-top: 1em; max-width: 440px">
      <div style="flex: 1">
        <div>Enable end to end encryption</div>
        <div class="dim" style="margin-top: 4px">You <strong>cannot</strong> disable this after creation. Most bots and bridges won't work with this yet.</div>
      </div>
      <Toggle />
    </div>
    {/if}
    {#if config.joinRule === "public"}
    <h3 class="title" style="margin-top: 1em">Room address</h3>
    <div style="display: flex; flex-direction: column">
      <IdInput kind="alias" homeserver={localStorage.getItem("homeserver")} lockHomeserver />
    </div>
    {/if}
    <div style="display:flex; margin-top: 1em;  max-width: 440px">
      <div style="flex: 1">
        <div>Disable federation</div>
        <div class="dim" style="margin-top: 4px">Prevents anyone not part of <strong>{localStorage.getItem("homeserver")}</strong> from ever joining this {current.type}</div>
      </div>
      <Toggle bind:checked={config.noFederate} />
    </div>
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" clicked={() => state.popup.set({ ...current, id: null })} />
    <Button
      type="primary"
      disabled={!config.name.length}
      loading={creating}
      label={creating ? `Creating ${capitalize(current.type)}...` : `Create ${capitalize(current.type)}`}
      clicked={create}
    />
  </div>
</Popup>

