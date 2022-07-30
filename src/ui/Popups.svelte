<script>
// TODO: move emoji picker and user popout here
// TODO: there has to be a cleaner way of doing this
import Todo from "./popups/Todo.svelte";
import Logout from "./popups/Logout.svelte";
import Switcher from "./popups/Switcher.svelte";
import Source from "./popups/Source.svelte";
import Create from "./popups/Create.svelte";
import Info from "./popups/Info.svelte";
import Leave from "./popups/Leave.svelte";
import Upload from "./popups/Upload.svelte";
import Attachment from "./popups/Attachment.svelte";
import Nickname from "./popups/Nickname.svelte";
import Member from "./popups/Member.svelte";
import Invite from "./popups/Invite.svelte";
import Ban from "./popups/Ban.svelte";
import Kick from "./popups/Kick.svelte";
import DeleteRecent from "./popups/DeleteRecent.svelte";

const popups = new Map();
popups.set("todo", Todo);
popups.set("logout", Logout);
popups.set("switcher", Switcher);
popups.set("source", Source);

// rooms
popups.set("create", Create);
popups.set("info", Info);
popups.set("leave", Leave);

// files
popups.set("upload", Upload);
popups.set("attachment", Attachment);

// member stuff
popups.set("member", Member);
popups.set("nickname", Nickname);
popups.set("invite", Invite);
popups.set("ban", Ban);
popups.set("kick", Kick);
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
    } else if(!$current.id) {
      state.popup.set({ id: "switcher" });
    }
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
  e.stopImmediatePropagation();
}
</script>
<style>
.wrap :global(.icon.close) {
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
