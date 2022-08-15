<script>
import Popup from "../atoms/Popup.svelte";
import Tooltip from "../atoms/Tooltip.svelte";
import Avatar from "../atoms/Avatar.svelte";
export let current;
$: reacts = current.event.reactions ?? new Map();
$: selected = [...reacts.keys()][0];
</script>
<style>
.content {
  width: 500px;
  height: 440px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
}

.side, .main {
  scrollbar-width: thin;
}

.side {
  background: red;
  width: 90px;
  padding: 8px;
  background: var(--bg-rooms-members);
  display: flex;
  flex-direction: column;
}

.reaction {
  padding: 4px 8px;
  border-radius: 2px;
  margin-bottom: 1px;
  cursor: pointer;
}

.reaction .emoji {
  margin: 0 4px;
}

.reaction:hover {
  background: var(--mod-lighten);
}

.reaction.selected {
  background: var(--mod-lightener);
}

.main {
  flex: 1;
  padding: 0 8px;
  background: var(--bg-content);
}

.sender {
  display: flex;
  align-items: center;
  border-bottom: solid var(--mod-lighten) 1px;
  height: 44px;
}

.sender .name {
  margin-left: 8px;
}

.dim {
  color: var(--fg-dim);
}
</style>
<Popup raw>
  <div slot="content" class="content">
    <div class="side scroll">
      {#each [...reacts.entries()] as [key, events]}
        <Tooltip tip="todo: shortcode" position="left">
          <div slot="tip">
            <!-- TOOD: actual shortcode, not just emoji -->
            <span class="dim">:</span>{events[0].shortcode ?? key}<span class="dim">:</span>
          </div>
          <div class="reaction" class:selected={selected === key} on:click={() => selected = key}>
            <span class="emoji">{key}</span>{events.length}
          </div>
        </Tooltip>
      {/each}
    </div>
    <div class="main scroll">
      {#each reacts.get(selected) as event}
        <!-- TODO: sender display name/avatar -->
        <div class="sender">
          <Avatar size={24} mxc={event.sender.avatar} />
          <div class="name">{event.sender.name}</div>
        </div>
      {/each}
    </div>
  </div>
</Popup>
