<script>
import Avatar from "../../atoms/Avatar.svelte";
import Toolbar from "../../atoms/Toolbar.svelte";
export let room;
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
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
}

.bridge .info {
  flex: 1;
  margin-left: 8px;
  line-height: 1.4;
}

[data-mx-ping] {
  position: relative;
  color: var(--color-accent);
  font-weight: 500;
  padding: 0 2px;
  cursor: pointer;
}

[data-mx-ping]::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  background: var(--color-accent);
  opacity: .1;
}

[data-mx-ping]:hover::after {
  opacity: .2;
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
</style>
<h3>Bridges</h3>
{#each room.getAllState("uk.half-shot.bridge") as event}
  {@const bridge = event.content}
  <div class="bridge">
    <Avatar user={{ id: bridge.protocol.id, avatar: bridge.protocol.avatar_url }} size={72} link={true} />
    <div class="info">
      <h4>{bridge.protocol.displayname ?? bridge.protocol.id}</h4>
      Currently being bridged to {bridge.channel.displayname ?? room.name}
      <hr />
      <!--This bridge was created by <span data-mx-ping={bridge.creator}>{bridge.creator}</span><br />-->
      This bridge is managed by <span data-mx-ping={bridge.bridgebot}>{bridge.bridgebot}</span><br />
    </div>
    <div class="toolbar">
      <Toolbar items={[{ clicked: () => state.popup.set({ id: "dev-event", event }), name: "view source", icon: "terminal" }]} />
    </div>
  </div>
{:else}
no bridges
{/each}
<div style="height: 18px"></div>
<h3>Bots</h3>
[waiting on msc - please hold...]
