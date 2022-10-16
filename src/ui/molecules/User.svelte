<script>
import Avatar from "../atoms/Avatar.svelte";
import { memberContext } from "../../util/context";
export let member;

function openMenu(e) {
  e.stopPropagation();
  state.context.set({ items: memberContext(member), x: e.clientX, y: e.clientY });
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
<div class="popout" on:contextmenu|preventDefault={openMenu}>
  <div class="top">
    <Avatar user={member} size={80} />
    <div class="icon" on:click={openMenu}>more_vert</div>
  </div>
  <h3>{member.name || member.id}</h3>
  <div class="id">{member.id}</div>
</div>
