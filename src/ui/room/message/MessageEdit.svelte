<script>
import { marked } from "marked";

export let event;
let textarea;
let rows = 1;
let input = event.content.body;
let { edit } = state.roomState;
let slice = state.slice;

function replacePing(input) {
  return input.replace(
    /@[a-z0-9-_/]+:[a-z0-9.-]+/ig,
    (match) => `<a href="https://matrix.to/#/${match}">@${getName(match)}</a>`
  );
}

async function handleKeyDown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!input.trim()) return;
    save();
  } else if (e.key === "Escape") {
    $edit = null;
  } if (e.key === "ArrowUp") {
    if (input !== event.content.body) return;
    if (textarea.selectionStart !== 0) return;
    if (textarea.selectionEnd !== 0) return;
    for (let i = $slice.events.findIndex(i => i.eventId === $edit) - 1; i >= 0; i--) {
      const event = $slice.events[i];
      if (event.sender === state.userId) {
        $edit = event.eventId;
        return;
      }
    }
  } if (e.key === "ArrowDown") {
    if (input !== event.content.body) return;
    if (textarea.selectionStart !== input.length) return;
    if (textarea.selectionEnd !== input.length) return;
    for (let i = $slice.events.findIndex(i => i.eventId === $edit) + 1; i < $slice.events.length; i++) {
      const event = $slice.events[i];
      if (event.sender === state.userId) {
        $edit = event.eventId;
        return;
      }
    }
    $edit = null;
  }
}

function handleInput() {
  rows = Math.min(input.split("\n").length, 10);
}

function save() {
  if (!input.trim()) {
    // TODO: delete message
  }
  const newEvent = {
    "m.relates_to": {
      rel_type: "m.replace",
      event_id: event.eventId,
    },
    "m.new_content": {
      body: input.trim(),
      format: "org.matrix.custom.html",
      formatted_body: marked(replacePing(input.trim())).trim(),
      msgtype: "m.text",
    },
    body: "* " + input.trim(),
    msgtype: "m.text",
  };
  state.api.sendEvent(event.roomId, "m.room.message", newEvent, Math.random());
  $edit = null;
}

setTimeout(() => {
  textarea.selectionStart = input.length;
});
</script>
<style>
.input {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  background: #40444b;
  margin: 4px 0;
}

textarea {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  outline: none;
  resize: none;

  flex: 1;
  padding: 11px 0;
}

textarea::placeholder {
  color: var(--fg-muted);
}

.info {
  font-size: 12px;
  margin: 4px 0;
}

.info a {
  cursor: pointer;
}
</style>
<div class="input">
  <textarea
    autofocus
    rows={rows}
    bind:this={textarea}
    bind:value={input}
    on:input={handleInput}
    on:keydown={handleKeyDown}
  ></textarea>
</div>
<div class="info">
  escape to <a on:click={e => { e.preventDefault(); $edit = null }}>cancel</a> •
  enter to <a on:click={e => { e.preventDefault(); save() }}>save</a>
</div>
