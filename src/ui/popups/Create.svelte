<script>
import Button from "../atoms/Button.svelte";
import Input from "../atoms/Input.svelte";
import Textarea from "../atoms/Textarea.svelte";
import Popup from "../atoms/Popup.svelte";

import Toggle from "../atoms/Toggle.svelte";
import Dropdown from "../atoms/Dropdown.svelte";
import IdInput from "../atoms/IdInput.svelte";

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
  const parentId = current.parent?.id;
  const initialState = [], creationContent = {};
  
  if (parentId) {
    initialState.push(
      { content: { canonical: true }, type: "m.space.parent", state_key: parentId },
      { content: { join_rule: "restricted", allow: [{ room_id: parentId, type: "m.room_membership" }] }, type: "m.room.join_rules" },
    );
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

  if (parentId) {
    state.api.sendState(parentId, "m.space.child", room_id, { auto_join: false, suggested: false, via: [room_id.match(/:.+/)[0].slice(1)] });  
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
  <!--<h2 slot="header" style="text-align: center">Customize {capitalize(current.type)}</h2>-->
  <h3 slot="header">Create {capitalize(current.type)}</h3>
  <div slot="content" style="display: flex; flex-direction: column;">
    <!--<div style="margin-bottom: 1em; max-width: 440px; text-align: center">
      Customize your {capitalize(current.type)} with an name, topic, and avatar. You can always change these later.
    </div>
    <img src="https://www.adweek.com/wp-content/uploads/2018/07/confused-guy-meme-content-2018.jpg" style="height: 80px; width: 80px; border-radius: 50%; margin: 0 auto"/>-->
    <span class="title">{capitalize(current.type)} Name</span>
    <Input placeholder="awesome-{current.type}" bind:value={config.name} submitted={create} autofocus />
    <span class="title" style="margin-top: 1em">{capitalize(current.type)} Topic </span>
    <Textarea placeholder="optional topic for your {current.type}" bind:value={config.topic} />
    <div style="border: solid var(--event-ping) 2px; background: var(--event-ping-bg); border-radius: 4px; padding: 8px; margin: 1em 0 8px;">
    everything below this is not implemented currently
    </div>
    <span class="title" style="margin-top: 1em">Room visibility</span>
    <Dropdown options={joinRules} bind:selected={config.joinRule} />
    {#if current.type !== "space" && config.joinRule !== "public"}
    <div style="display:flex; margin-top: 1em; max-width: 440px">
      <div style="flex: 1">
        <div>Enable end to end encryption</div>
        <div class="dim" style="margin-top: 4px">You <strong>cannot</strong> disable this after creation. Most bots and bridges won't work with this yet.</div>
      </div>
      <Toggle />
    </div>
    {/if}
    {#if config.joinRule === "public"}
    <span class="title" style="margin-top: 1em">Room address</span>
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

