<script>
import Radio from "../../atoms/Radio.svelte";
import Toggle from "../../atoms/Toggle.svelte";
import RadioInline from "../../atoms/RadioInline.svelte";
import Event from "../../room/timeline/Event.svelte";
const { settings } = state;

function makeMockEvent(body) {
  const me = state.users.get(state.userId);
  const room = { power: {} };
  const member = { ...(me ?? { id: state.userId }), room };
  return {
    sender: member,
    date: new Date(),
    id: "$" + Math.random(),
    type: "m.room.message",
    content: { body },
    room,
  };
}

let a = "never";
</script>
<style>
.message-preview {
  padding: 8px 0;
  min-height: 144px;
  height: 144px;
  background: var(--bg-rooms-members);
  border: solid var(--bg-spaces) 1px;
  border-radius: 4px;
  overflow: hidden;
}

.message-preview > div:first-child {
  margin-top: -36px;
}

.message-preview > div:hover {
  background: var(--mod-darken);
}

.message-preview > .header {
  margin-top: 14px;
}

.option {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
<div class="message-preview">
  <div><Event header noInteract event={makeMockEvent("look at me im doing an internet")} /></div>
  <div><Event noInteract event={makeMockEvent("using matrix on the interwebz")} /></div>
  <div class="header"><Event header noInteract event={makeMockEvent("where will i go next")} /></div>
  <div><Event noInteract event={makeMockEvent("oh, i know!")} /></div>
  <div><Event noInteract event={makeMockEvent("https://www.youtube.com/watch?v=dQw4w9WgXcQ")} /></div>
</div>
<div style="min-height: 16px"></div>
<div class="title">User colors</div>
<Radio
  options={[
    { name: "Always", id: "always"},
    { name: "If they have a power level", id: "power"},
    { name: "Never", id: "never"}
  ]}
  selected={$settings.get("namecolors")}
  changed={(id) => $settings.put("namecolors", id)}
/>
<div style="height: 1em"></div>
<div class="title">Room timeline</div>
<!-- "show member events in public rooms" -->
{#each [
  ["Show join and leaves", "showjoinleave"],
  ["Show name and avatar changes", "shownickavatar"],
] as [name, setting]}
<div class="option">
  <b>{name}</b>
  <Toggle checked={$settings.get(setting)} toggled={(val) => $settings.put(setting, val)}/>
</div>
{/each}
<div style="min-height: 16px"></div>
<!--
<table>
  <tr>
    <th class="title">Name</th>
    <th class="title">Never</th>
    <th class="title">In private rooms</th>
    <th class="title">Always</th>
  </tr>
{#each [
  ["Show join and leaves", "showjoinleave"],
  ["Show name and avatar changes", "shownickavatar"],
  ["Show moderation actions", "showmoderation"],
  ["Show unknown events", "showunknown"],
] as [name, setting]}
  <tr>
    <td>{name}</td>
    <td style="width: 36px;"><RadioInline bind:group={a} value="never" /></td>
    <td style="width: 36px;"><RadioInline bind:group={a} value="private" /></td>
    <td style="width: 36px;"><RadioInline bind:group={a} value="always" /></td>
  </tr>
{/each}
</table>
-->
<div style="min-height: 16px"></div>
<div class="title">Misc</div>
<div class="option">
  <b>Reduce motion</b>
  <Toggle checked={$settings.get("reducemotion")} toggled={(val) => $settings.put("reducemotion", val)}/>
</div>
