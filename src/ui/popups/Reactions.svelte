<script>
import Popup from "../atoms/Popup.svelte";
import Tooltip from "../atoms/Tooltip.svelte";
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
  padding: 4px 8px;
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
  border-bottom: solid var(--mod-lighten) 1px;
  padding: 8px 0;
}
</style>
<Popup raw>
  <div slot="content" class="content">
    <div class="side scroll">
      {#each [...reacts.entries()] as react}
        <Tooltip tip="todo: shortcode" position="left">
          <div class="reaction" class:selected={selected === react[0]} on:click={() => selected = react[0]}>
            <span class="emoji">{react[0]}</span>{react[1].count}
          </div>
        </Tooltip>
      {/each}
    </div>
    <div class="main scroll">
      {#each [...reacts.get(selected).senders] as sender}
        <!-- TODO: sender display name/avatar -->
        <div class="sender">
          {sender}
        </div>
      {/each}
    </div>
  </div>
</Popup>
