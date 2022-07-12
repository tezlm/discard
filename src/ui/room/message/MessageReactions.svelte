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
  background: var(--event-focus-bg);
  border: solid var(--event-focus) 1px;
  border-radius: 8px;
  cursor: pointer;
}

.key, .count {
  display: inline-block;
  margin: 0 2px;
}
</style>
<div class="reactions">
{#each [...event.reactions.entries()] as reaction}
<div class="reaction" on:click={todo}>
  <div class="key">{reaction[0]}</div>
  <div class="count">{reaction[1]}</div>
</div>
{/each}
</div>
