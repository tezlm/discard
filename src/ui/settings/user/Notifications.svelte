<script>
import Toggle from "../../atoms/Toggle.svelte";
import RadioInline from "../../atoms/RadioInline.svelte";
import hljs from "highlight.js";
let { accountData } = state;

function config(id, value) {
  // todo();
}

const options = {
  global: [
    { name: "Direct messages",           id: "global-direct",     value: "off" },
    { name: "Encrypted direct messages", id: "global-encdirect",  value: "off" },
    { name: "Room messages",             id: "global-message",    value: "off" },
    { name: "Encrypted room messages",   id: "global-encmessage", value: "off" },
  ],
  mentions: [
    { name: "Messages with my display name", id: "mentions-displayname", value: "off" },
    { name: "Messages with my username",     id: "mentions-username",    value: "off" },
    { name: "Messages with @room",           id: "mentions-everyone",    value: "off" },
    { name: "Messages containing keywords",  id: "mentions-keywords",    value: "off" },
  ],
  misc: [
    { name: "Room invites",            id: "misc-invites",  value: "off" },
    { name: "Room upgraded",           id: "misc-upgrades", value: "off" },
    { name: "Messages sent from bots", id: "misc-bots",     value: "off" },
  ],
};
</script>
<style>
.group {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.options {
  margin-top: 16px;
}

.options > div {
  display: flex;
  margin-top: 8px;
}

.options .title {
  margin-bottom: 0;
}

.options .title:not(:first-child) {
  text-align: center;
}

.options > div > div {
  width: 48px;
}

.options > .row > div:not(:first-child) {
  display: flex;
  justify-content: center;
}

.options > div > div:first-child {
  flex: 1;
}
</style>
<p>todo: show notificaton bubble, play notification sound toggles</p>
<p>todo: should ignored users be in notifications, privacy/security, or somewhere else?</p>
<br />
<div class="group">
  <div>Enable desktop notifications</div>
  <!-- <Toggle checked={$settings.get("shadowsettings")} toggled={(val) => $settings.put("shadowsettings", val)}/> -->
  <Toggle checked={false} toggled={() => 0}/>
</div>
<div class="group">
  <div>Enable notification sound</div>
  <Toggle checked={false} toggled={() => 0}/>
</div>
{#each ["global", "mentions", "misc"] as category}
  <div class="options">
    <div>
      <div class="title">{category}</div>
      <div class="title">Off</div>
      <div class="title">On</div>
      <div class="title">Noisy</div>
    </div>
    {#each options[category] as option}
      <div class="row">
        <div>{option.name}</div>
        <div><RadioInline bind:group={option.value} value="off"   on:click={() => config(option.id, "off")} /></div>
        <div><RadioInline bind:group={option.value} value="on"    on:click={() => config(option.id, "on")} /></div>
        <div><RadioInline bind:group={option.value} value="noisy" on:click={() => config(option.id, "noisy")} /></div>
      </div>
    {/each}
  </div>
{/each}
<br />
<pre><code>{@html hljs.highlight("json", JSON.stringify($accountData.get("m.push_rules"), null, 4)).value}</code></pre>
<br />
<br />
<br />
<br />
