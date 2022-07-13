<script>
export let event;
</script>
<style>
.reactions {
  margin-top: 4px;
}

.reaction {
  display: inline-block;
  padding: 2px 4px;
  margin-right: 4px;
  color: var(--fg-notice);
  background: var(--bg-rooms-members);
  border: solid var(--bg-rooms-members) 1px; 
  border-radius: 8px;
  cursor: pointer;
  transition: all .1s;
}

.reaction:hover {
  background: var(--bg-content);
  border: solid var(--color-gray-light) 1px; 
}

.key, .count {
  display: inline-block;
  margin: 0 2px;
}

.reaction.self {
  background: var(--event-focus-bg);
  border: solid var(--event-focus) 1px; 
}
</style>
<div class="reactions">
{#each [...event.reactions.entries()] as reaction}
<div class="reaction" class:self={reaction[1][1]} on:click={todo}>
  <div class="key">{reaction[0]}</div>
  <div class="count">{reaction[1][0]}</div>
</div>
{/each}
</div>
