<script>
import { backOut, quadOut } from "svelte/easing";
import Tooltip from "../../atoms/Tooltip.svelte";
import Emoji from "../../molecules/Emoji.svelte";
export let event;
export let room;

// i have no idea how these work but they do so /shrug lol
// TODO: make the number animate in reverse when the count goes down
// TODO: reuse emoji picker everywhere

let showPicker = false;

function getPeople(set) {
  const ids = [...set].map(i => room.members.get(i)?.name || i);
  if (set.size === 1) return [ids[0]];
  if (set.size === 2) return [ids[0], " and ", ids[1]];
  if (set.size < 7) return [ids.slice(0, -1).join(", "), " and ", ids[ids.length - 1]];
  return [ids.slice(0, 6).join(", "), " and ", ids.length - 5, " others "];
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

function fly() {
  return {
    duration: 200,
    easing: quadOut,
    css: t => `transform: translateX(${t * -15 + 15}px)`,
  };
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
  display: flex;
  position: relative;
  align-items: center;
  margin-top: 4px;
  user-select: none;
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
  position: relative;
  margin-left: 4px;
}

.add .icon {
  opacity: 0;
  color: var(--fg-dim);
  cursor: pointer;
  transition: all .2s;
}

.add .icon:hover, .add .icon.show {
  color: var(--fg-content);
  opacity: 1;
}

.dim {
  color: var(--fg-dim);
}

.picker {
  position: absolute;
  top: 0;
  left: 22px;
  z-index: 1;
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
<div class="add">
  <div class="icon" class:show={showPicker} on:click={(e) => { e.stopImmediatePropagation(); showPicker = !showPicker }}>add_reaction</div>
  {#if showPicker}
  <div class="picker" in:fly>
    <Emoji selected={(emoji, keep) => {
      if (!event.reactions?.get(emoji)?.mine && emoji) {
        const reaction = {
          "m.relates_to": {
            key: emoji,
            rel_type: "m.annotation",
            event_id: event.eventId,
          },
        };
        state.api.sendEvent(event.roomId, "m.reaction", reaction, Math.random());  
      }
      if (!keep) showPicker = false;
    }} />
  </div>
  {/if}
</div>
</div>
<svelte:window on:click={() => showPicker = false} />
