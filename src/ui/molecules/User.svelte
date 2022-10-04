<script>
import Avatar from "../atoms/Avatar.svelte";
export let member;

let { input } = state.roomState;

function getUserMenu() {
  const name = member.name || member.userId;
  return [
    { label: "Profile", icon: "person",        clicked: todo },
    { label: "Mention", icon: "notifications", clicked: () => $input += member.id },
    { label: "Message", icon: "message",       clicked: todo },
    { label: "Block",   icon: "block",         clicked: todo },
    null,
    { label: "Remove Messages", icon: "delete",        color: "var(--color-red)", clicked: () => state.popup.set({ id: "deleterecent", room, member }) },
    { label: `Kick ${name}`,    icon: "person_remove", color: "var(--color-red)", clicked: () => state.popup.set({ id: "kick",         room, member }) },
    { label: `Ban ${name}`,     icon: "person_remove", color: "var(--color-red)", clicked: () => state.popup.set({ id: "ban",          room, member }) },
    null,
    { label: "Power",   clicked: todo, submenu: [] },
    null,
    { label: "Copy ID", clicked: copy(member.id), icon: "terminal" },
  ];

	function copy(text) {
		return () => navigator.clipboard.writeText(text);
	}
}
</script>
<style>
.popout {
  min-width: 300px;
  padding: 16px;
  background: var(--bg-context);
  border-radius: 8px;
  box-shadow: var(--shadow-popup);
}

.popout .top {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.top .icon {
  font-size: 22px;
  cursor: pointer;
}

.top .icon:hover {
  color: var(--fg-notice);
}

.popout h3 {
  margin-top: 8px;
  font-weight: 500;
  font-family: var(--font-display);
  color: var(--fg-notice);
}

.popout .id {
  color: var(--fg-muted);
  font-size: 14px;
  user-select: all;
}
</style>
<div class="popout">
  <div class="top">
    <Avatar user={member} size={80} />
    <div
      class="icon"
      on:click|preventDefault|stopPropagation={e => state.context.set({ items: getUserMenu(), x: e.clientX, y: e.clientY })}
      on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: getUserMenu(), x: e.clientX, y: e.clientY })}
    >
      more_vert
    </div>
  </div>
  <h3>{member.name}</h3>
  <div class="id">{member.id}</div>
</div>
