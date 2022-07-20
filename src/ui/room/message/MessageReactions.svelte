<script>
import { backOut } from "svelte/easing";
export let event;

// i have no idea how these work but they do so /shrug lol
// TODO: make the number animate in reverse when the count goes down

function counterIn() {
  return {
    duration: 200,
    easing: backOut,
    css: t => `bottom: ${22 - t * 20}px`,
  }
}

function counterOut() {
  return {
    duration: 200,
    easing: backOut,
    css: t => `top: ${22 - t * 20}px`,
  }
}

function handleClick(key) {
  const myReactionId = event.reactions.get(key)[1];
  // instantly respond with reaction?
  if (myReactionId) {
    state.api.redactEvent(event.roomId, myReactionId);
  } else {
    const reaction = {
      "m.relates_to": {
        key,
        rel_type: "m.annotation",
        event_id: event.eventId,
      },
    };
    state.api.sendEvent(event.roomId, "m.reaction", reaction, Math.random());  
  }
}
</script>
<style>
.reactions {
  margin-top: 4px;
}

.reaction {
  display: inline-block;
  position: relative;
  overflow: hidden;
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

.key, .spacer, .count {
  display: inline-block;
  margin: 0 2px;
}

.spacer {
  opacity: 0;
}

.count {
  position: absolute;
}

.reaction.self {
  background: var(--event-focus-bg);
  border: solid var(--event-focus) 1px; 
}

.add {
  display: inline-block;
  opacity: 0;
  color: var(--fg-dim);
  cursor: pointer;
  transition: all .2s;
}

.add:hover {
  opacity: 1;
}
</style>
<div class="reactions">
{#each [...event.reactions.entries()] as reaction}
  {#if reaction[1][0]}
  <div class="reaction" class:self={reaction[1][1]} on:click={() => handleClick(reaction[0])}>
    <div class="key">{reaction[0]}</div>
    {#key reaction[1][0]}
      <div class="count" in:counterIn out:counterOut>
      {reaction[1][0]}
      </div>
    {/key}
    <div class="spacer">
    {reaction[1][0]}
    </div>
  </div>
  {/if}
{/each}
<div class="add" class:self={false} on:click={todo}>+</div>
</div>
