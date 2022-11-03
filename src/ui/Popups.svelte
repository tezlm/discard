<script>
// TODO: there has to be a cleaner way of doing this
import Todo from "./popups/Todo.svelte";
import Error from "./popups/Error.svelte";
import Switcher from "./popups/Switcher.svelte";

import Dialog from "./popups/Dialog.svelte";

import Create from "./popups/Create.svelte";
import Join from "./popups/Join.svelte";
import Info from "./popups/Info.svelte";
import Leave from "./popups/Leave.svelte";
import AddExisting from "./popups/AddExisting.svelte";
import DevRoom from "./popups/DevRoom.svelte";

import Redact from "./popups/Redact.svelte";
import Pin from "./popups/Pin.svelte";
import Reactions from "./popups/Reactions.svelte";
import DevEvent from "./popups/DevEvent.svelte";

import Upload from "./popups/Upload.svelte";
import Attachment from "./popups/Attachment.svelte";

// import Nickname from "./popups/Nickname.svelte";
import User from "./popups/User.svelte";
import Invite from "./popups/Invite.svelte";
import Kick from "./popups/Kick.svelte";
import Ban from "./popups/Ban.svelte";
import Unban from "./popups/Unban.svelte";
import DeleteRecent from "./popups/DeleteRecent.svelte";

const popups = new Map();
popups.set("todo", Todo);
popups.set("error", Error);
popups.set("switcher", Switcher);
popups.set("dialog", Dialog);

// rooms
popups.set("create", Create);
popups.set("join", Join);
popups.set("info", Info);
popups.set("leave", Leave);
popups.set("addexisting", AddExisting);
popups.set("dev-room", DevRoom);

// events
popups.set("redact", Redact);
popups.set("pin", Pin);
popups.set("reactions", Reactions);
popups.set("dev-event", DevEvent);

// files
popups.set("upload", Upload);
popups.set("attachment", Attachment);

// member stuff
popups.set("user", User);
// popups.set("nickname", Nickname);
popups.set("invite", Invite);
popups.set("kick", Kick);
popups.set("ban", Ban);
popups.set("unban", Unban);
popups.set("deleterecent", DeleteRecent);

let current = state.popup;

$: if ($current.id) {
  state.log.ui("open popup " + $current.id);
}

function closePopup() {
  state.popup.set({ ...$current, id: null });
}

function handleKeyDown(e) {
  if (e.code === "KeyK" && e.ctrlKey) {
    if ($current.id === "switcher") {
      closePopup();
    } else if (!$current.id) {
      state.popup.set({ id: "switcher" });
    }
    e.preventDefault();
    return;
  }

  if (!$current.id) return;

  if (e.key === "Enter" && $current.confirm) {
    $current.confirm();
  } else if (e.key === "Escape") {
    $current.cancel && $current.cancel();
  } else {
    return;
  }

  closePopup();
  e.preventDefault();
}
</script>
<style>
.wrap {
  pointer-events: auto;
}

.wrap :global(h2 > .icon.close),
.wrap :global(h3 > .icon.close) {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 28px;
  font-weight: normal;
  color: var(--fg-muted);
  cursor: pointer;
  transition: color 0.4s;
}

.wrap :global(.icon.close:hover) {
  color: var(--fg-notice);
}
</style>
<div class="wrap">
  <svelte:component this={popups.get($current.id)} current={$current} bind:confirm={$current.confirm} />
</div>
<svelte:window on:keydown={handleKeyDown} />
