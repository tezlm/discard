<script>
import twemoji from "twemoji";
import { backOut } from "svelte/easing";
import { parseMxc } from "../../../util/content";
import Tooltip from "../../atoms/Tooltip.svelte";
export let event;

// TODO: make the number animate in reverse when the count goes down

let showPicker = false;
let addEl;

function getTwemoji(unicode) {
  return twemoji.parse(unicode, {
    attributes: () => ({ loading: 'lazy' }),
    folder: "svg",
    ext: ".svg",
  });
}

function formatPeople(events) {
  const names = events.map(i => escapeHtml(i.sender.name ?? i.sender.id, i.sender));
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} ${l("and")} ${names[1]}`;
  if (names.length < 7) return `${names.slice(0, -1).join(l(", "))} ${l("and")} ${names.at(-1)}`;
  return `${names.slice(0, 6).join(l(", "))} ${l("and")} ${names.length - 5} ${l("others")}`;

  function l(str) {
    return `<span class="dim">${str}</span>`;
  }

  function escapeHtml(str, sender) {
    if (!str) {
      console.warn("unknown sender", sender);
      return "unknown person";
    }
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

function handleClick(mine, key) {
  // instantly respond with reaction/local echo?
  if (mine) {
    mine.redact();
  } else {
    const reaction = {
      "m.relates_to": {
        key,
        rel_type: "m.annotation",
        event_id: event.id,
      },
    };
    state.api.sendEvent(event.room.id, "m.reaction", reaction, Math.random());  
  }
}

$: if (showPicker) {
  queueMicrotask(() => {
    const rect = addEl.getBoundingClientRect();
    state.popout.set({
      id: "emoji",
      animate: "right",
      top: rect.top,
      left: rect.left + 24,
      selected(emoji, keepOpen) {
        if (emoji && !event.reactions?.get(emoji)?.find(i => i.sender.id === state.userId)) {
          const reaction = {
            "m.relates_to": {
              key: emoji,
              rel_type: "m.annotation",
              event_id: event.id,
            },
          };
          state.api.sendEvent(event.room.id, "m.reaction", reaction, Math.random());  
        }
        if (!keepOpen) showPicker = false;
      },
    });
  });
} else {
  state.popout.set({});
}
</script>
<style>
.reactions {
  display: flex;
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  user-select: none;
}

.reaction {
  display: inline-flex;
  position: relative;
  overflow: hidden;
  padding: 2px 4px;
  margin-right: 4px;
  margin-bottom: 4px;
  min-width: 40px;

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
}

.key {
  color: var(--fg-content);
}

.key :global(img) {
  height: 16px;
  margin-top: 2px;
  margin-bottom: -2px;
  transform: none;
  vertical-align: initial;
}

.spacer {
  visibility: hidden;
  margin-left: 4px;
}

.count {
  position: absolute;
  right: 4px;
  color: var(--fg-content);
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
</style>
<div class="reactions">
{#each [...event.reactions.entries()] as [key, events] (key)}
  {@const { shortcode } = events[0].content}
  <Tooltip>
    <span slot="tip">
      {@html formatPeople(events)}
      <span class="dim">reacted with</span>
      {#if key.startsWith("mxc://")}
        <span class="dim">:</span>{shortcode}<span class="dim">:</span>
      {:else}
        {key}
      {/if}
    </span>
    <div class="reaction" class:self={getMine(events)} on:click={() => handleClick(getMine(events), key)}>
      <div class="key">
        {#if key.startsWith("mxc://")}
          <img src={parseMxc(key)} alt={shortcode}>
        {:else}
          {@html getTwemoji(key)}
        {/if}
      </div>
      {#key events.length}
        <div class="count" in:counterIn|local={{ count: events.length }} out:counterOut|local>
          {events.length}
        </div>
      {/key}
      <div class="spacer">
      {events.length}
      </div>
    </div>
  </Tooltip>
{/each}
<div class="add" bind:this={addEl}>
  <div class="icon" class:show={showPicker} on:click|stopPropagation={() => showPicker = !showPicker }>add_reaction</div>
</div>
</div>
<svelte:window on:click={() => showPicker = false} />
