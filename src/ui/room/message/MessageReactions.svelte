<script>
import { backOut, quadOut } from "svelte/easing";
import { parseMxc } from "../../../util/content";
import Tooltip from "../../atoms/Tooltip.svelte";
import Emoji from "../../molecules/Emoji.svelte";
export let event;
// let popout = state.popout;

// i have no idea how these work but they do so /shrug lol
// TODO: make the number animate in reverse when the count goes down
// TODO: reuse emoji picker everywhere

let showPicker = false;

function formatPeople(events) {
  const names = events.map(i => escapeHtml(i.sender.name));
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} ${l("and")} ${names[1]}`;
  if (names.length < 7) return `${names.slice(0, -1).join(l(", "))} ${l("and")} ${names.at(-1)}`;
  return `${names.slice(0, 6).join(l(", "))} ${l("and")} ${names.length - 5} ${l("others")}`;

  function l(str) {
    return `<span class="dim">${str}</span>`;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

function getMine(events) {
  return events.find(i => i.sender.userId === state.userId);
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
  // instantly respond with reaction/local echo?
  if (mine) {
    state.api.redactEvent(mine.roomId, mine.eventId);
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
  flex-wrap: wrap;
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
  border-radius: 6px;
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
  height: 1em;
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

:global(.dim) {
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
{#each [...event.reactions.entries()] as [key, events]}
  <Tooltip>
    <span slot="tip">
      {@html formatPeople(events)}
      <span class="dim">reacted with</span>
      {#if key.startsWith("mxc://")}
        <span class="dim">:</span>{events[0].content.shortcode}<span class="dim">:</span>
      {:else}
        {key}
      {/if}
    </span>
    <div class="reaction" class:self={getMine(events)} on:click={() => handleClick(getMine(events), key)}>
      {#if key.startsWith("mxc://")}
        <img class="key" src={parseMxc(key)}>
      {:else}
        <div class="key">{key}</div>
      {/if}
      {#key events.length}
        <div class="count" in:counterIn out:counterOut>
        {events.length}
        </div>
      {/key}
      <div class="spacer">
      {events.length}
      </div>
    </div>
  </Tooltip>
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
