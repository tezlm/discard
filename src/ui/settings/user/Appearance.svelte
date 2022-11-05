<script>
import Radio from "../../atoms/Radio.svelte";
import Toggle from "../../atoms/Toggle.svelte";
import RadioInline from "../../atoms/RadioInline.svelte";
import Event from "../../room/timeline/Event.svelte";
const { settings } = state;

function makeMockEvent(body) {
  const me = state.users.get(state.userId);
  const room = { power: {} };
  const member = { ...(me ?? { id: state.userId }), power: 9001, room };
  return {
    sender: member,
    date: new Date(),
    id: "$" + Math.random(),
    type: "m.room.message",
    content: { body },
    room,
  };
}

const eventOptions = [
  { name: "Show join and leaves",                 id: "showjoinleave",  value: $settings.get("showjoinleave") },
  { name: "Show name and avatar changes",         id: "shownickavatar", value: $settings.get("shownickavatar") },
  { name: "Show moderation actions",              id: "showmoderation", value: $settings.get("showmoderation") },
  { name: "Show other changes (eg. pins, alias)", id: "showmisc",       value: $settings.get("showmisc") },
  { name: "Show unknown events",                  id: "showunknown",    value: $settings.get("showunknown") },
];
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

.events > div {
  display: flex;
  margin-top: 8px;
}

.events > .title {
  text-align: center;
}

.events > div > div {
  width: 64px;
}

.events > .row > div:not(:first-child) {
  padding: 0 8px;
}

.events > div > div:first-child {
  flex: 1;
}
</style>
<div class="message-preview">
  <div><Event header noInteract event={makeMockEvent("look at me im doing an internet")} /></div>
  <div><Event noInteract event={makeMockEvent("using matrix on the interwebz")} /></div>
  <div class="header"><Event header noInteract event={makeMockEvent("where will i go next")} /></div>
  <div><Event noInteract event={makeMockEvent("oh, i know!")} /></div>
  <div><Event noInteract event={makeMockEvent($settings.get("reducemotion") ? "https://www.youtube.com/watch?v=R8U2ElYYChs" : "https://www.youtube.com/watch?v=dQw4w9WgXcQ")} /></div>
</div>
<div style="min-height: 16px"></div>
<div class="title">Name Colors</div>
<Radio
  options={[
    { name: "Always", id: "always"},
    { name: "If they have a power level", id: "power"},
    { name: "Never", id: "never"}
  ]}
  selected={$settings.get("namecolors")}
  changed={(id) => $settings.put("namecolors", id)}
/>
<div style="min-height: 16px"></div>
<div class="events">
  <div>
    <div class="title">Event display options</div>
    <div class="title">Never</div>
    <div class="title">Private rooms</div>
    <div class="title">Always</div>
  </div>
  {#each eventOptions as option}
    <div class="row">
      <div>{option.name}</div>
      <div><RadioInline bind:group={option.value} value="never"   clicked={() => $settings.put(option.id, "never")} /></div>
      <div><RadioInline bind:group={option.value} value="private" clicked={() => $settings.put(option.id, "private")} /></div>
      <div><RadioInline bind:group={option.value} value="always"  clicked={() => $settings.put(option.id, "always")} /></div>
    </div>
  {/each}
</div>
<div style="min-height: 16px"></div>
<div class="title">Misc</div>
<div class="option">
  <b>Reduce motion</b>
  <Toggle checked={$settings.get("reducemotion")} toggled={(val) => $settings.put("reducemotion", val)}/>
</div>
<!-- spice up someone's day by showing them development settings -->
{#if Math.random() > .99 && !$settings.get("shadowsettings")}
<div class="option">
  <b>Shadow settings</b>
  <Toggle checked={$settings.get("shadowsettings")} toggled={(val) => $settings.put("shadowsettings", val)}/>
</div>
{/if}
