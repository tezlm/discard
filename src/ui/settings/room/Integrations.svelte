<script>
import Avatar from "../../atoms/Avatar.svelte";
import Toolbar from "../../atoms/Toolbar.svelte";
export let room;
let { popup, settings } = state;
</script>
<style>
h3 {
  color: var(--fg-content);
}

h4 {
  font-size: 18px;
}

.bridge {
  position: relative;
  display: flex;
  flex-direction: row;

  border: solid var(--bg-spaces) 1px;
  background: var(--bg-rooms-members);
  padding: 16px;
  border-radius: 4px;
  margin-top: 8px;
}

.bridge .info {
  flex: 1;
  margin-left: 16px;
  line-height: 1.4;
}

.toolbar {
  position: absolute;
  right: 8px;
  top: 8px;
	display: none;
}

.bridge:hover .toolbar {
	display: block;
}

.card {
  display: inline-flex;
  border: solid var(--bg-spaces) 1px;
  border-radius: 4px;
  margin-left: 2px;
}

.card .type {
  background: var(--bg-spaces);
  padding: 0 4px;
}

.card .value {
  background: var(--bg-misc);
  padding: 0 4px;
}
</style>
<h3>Bridges</h3>
{#each room.getAllState("m.bridge") as event}
  {@const bridge = event.content}
  {@const botPromise = room.members.fetch(bridge.bridgebot)}
  <div class="bridge">
    <Avatar user={{ id: bridge.protocol.id, avatar: bridge.protocol.avatar_url }} size={64} link={true} />
    <div class="info">
      <h4>{bridge.protocol?.displayname ?? bridge.protocol?.id}</h4>
      This room is currently being bridged to: 
      {#if bridge.channel}
      <div class="card">
        <div class="type">Channel:</div>
        <div class="value">{bridge.channel.displayname ?? bridge.channel.id}</div>
      </div>
      {/if}
      {#if bridge.network}
      <div class="card">
        <div class="type">Network:</div>
        <div class="value">{bridge.network.displayname ?? bridge.network.id}</div>
      </div>
      {/if}
      {#if bridge.protocol}
      <div class="card">
        <div class="type">Protocol:</div>
        <div class="value">{bridge.protocol.displayname ?? bridge.protocol.id}</div>
      </div>
      {/if}
      <hr />
      This bridge is managed by
      <span data-mx-ping={bridge.bridgebot}>
        {#await botPromise}
        {bridge.bridgebot}
        {:then bot}
        {bot?.name ? ("@" + bot.name) : bridge.bridgebot}
        {/await}
      </span>
    </div>
    {#if $settings.get("shadowdev")}
    <div class="toolbar">
      <Toolbar items={[{ clicked: () => $popup = { id: "dev-event", event }, name: "view source", icon: "terminal" }]} />
    </div>
    {/if}
  </div>
{:else}
<i style="margin-top: 12px">There are no bridges here!</i>
{/each}
<!--
<div style="height: 18px"></div>
<h3>Bots</h3>
[waiting on msc - please hold...]
-->
