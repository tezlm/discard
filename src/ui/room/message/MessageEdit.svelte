<script>
import { marked } from "marked";

export let event;
let textarea;
let rows = 1;
let input = event.content.body;
let { edit } = state.roomState;
let { slice, popup } = state;
$: rows = Math.min(input.split("\n").length, 10);

function replacePing(input) {
  function getName(id) {
    const member = event.room.members.get(id);
    if (!member) return id;
    return member.name ? ("@" + member.name) : member.id;
  }

  return input.replace(
    /@[a-z0-9-_/]+:[a-z0-9.-]+/ig,
    (match) => `<a href="https://matrix.to/#/${match}">${getName(match)}</a>`
  );
}

async function handleKeyDown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    save();
  } else if (e.key === "Escape") {
    $edit = null;
  } if (e.key === "ArrowUp") {
    if (input !== event.content.body) return;
    if (textarea.selectionStart !== 0) return;
    if (textarea.selectionEnd !== 0) return;
    for (let i = $slice.events.findIndex(i => i.id === $edit) - 1; i >= 0; i--) {
      const event = $slice.events[i];
      if (event.sender.id === state.userId) {
        $edit = event.id;
        return;
      }
    }
  } if (e.key === "ArrowDown") {
    if (input !== event.content.body) return;
    if (textarea.selectionStart !== input.length) return;
    if (textarea.selectionEnd !== input.length) return;
    for (let i = $slice.events.findIndex(i => i.id === $edit) + 1; i < $slice.events.length; i++) {
      const event = $slice.events[i];
      if (event.sender.id === state.userId) {
        $edit = event.id;
        return;
      }
    }
    $edit = null;
  }
}

async function save() {
  if (!input.trim()) {
     // FIXME: find a better way than ugly hack
    $edit = null;
    setTimeout(() => {
      $popup = { id: "redact", event };
      document.activeElement.blur();
      new Promise(res => {
        let unsub;
        unsub = popup.subscribe(({ id }) => {
          if (id) return;
          unsub();
          res();
        });
      }).then(() => {
        $edit = event.id;
        $edit = null;
      });
    });
    return;
  } else if (input.trim() === event.content.body) {
    $edit = null;
    return;
  }
  const newContent = {
    "m.relates_to": {
      rel_type: "m.replace",
      event_id: event.id,
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
  event.room.sendEvent("m.room.message", newContent);
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
    on:keydown={handleKeyDown}
  ></textarea>
</div>
<div class="info">
  escape to <a on:click|preventDefault={() => $edit = null}>cancel</a> •
  enter to <a on:click|preventDefault={save}>save</a>
</div>
