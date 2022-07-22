<script>
import { backOut } from "svelte/easing";
import Tooltip from "../../atoms/Tooltip.svelte";
export let event;
$: room = state.rooms.get(event.roomId);

// i have no idea how these work but they do so /shrug lol
// TODO: make the number animate in reverse when the count goes down

function getPeople(set) {
  const ids = [...set].map(i => room.members.get(i)?.name || i);
  if (set.size === 1) return [ids[0]];
  if (set.size === 2) return [ids[0], " and ", ids[1]];
  if (set.size < 6) return [ids.slice(0, -1).join(", "), " and ", ids[1]];
  return [ids.slice(0, 6).join(", "), " and ", ids.length - 6, " others "];
}

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

function handleClick(mine, key) {
  // instantly respond with reaction?
  if (mine) {
    state.api.redactEvent(event.roomId, mine);
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

.dim {
  color: var(--fg-dim);
}
</style>
<div class="reactions">
{#each [...event.reactions.entries()] as [key, { count, mine, senders }]}
  {#if count}
  <Tooltip>
    <span slot="tip">
      {#each getPeople(senders) as part, i}
      {#if i % 2 === 0}
        {part}
      {:else}
        <span class="dim">{part}</span>
      {/if}
      {/each}
      <span class="dim">reacted with</span> {key}
    </span>
    <div class="reaction" class:self={mine} on:click={() => handleClick(mine, key)}>
      <div class="key">{key}</div>
      {#key count}
        <div class="count" in:counterIn out:counterOut>
        {count}
        </div>
      {/key}
      <div class="spacer">
      {count}
      </div>
    </div>
  </Tooltip>
  {/if}
{/each}
<div class="add" class:self={false} on:click={todo}>+</div>
</div>
