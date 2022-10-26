<script>
import Avatar from "../atoms/Avatar.svelte";
import { memberContext } from "../../util/context";
import { fastclick } from "../../util/use";
export let member;
let { popup, popout, context } = state;

function openMenu(e) {
  $context = { items: memberContext(member), x: e.clientX, y: e.clientY };
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

.avatar {
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.view-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 100%;
  width: 100%;
  
  background: #11111188;
  font: 12px var(--font-display);
  font-weight: 700;
  cursor: pointer;
  
  opacity: 0;
  transition: opacity .2s;
}

.view-profile:hover {
  opacity: 1;
}
</style>
<div class="popout" on:contextmenu|preventDefault|stopPropagation={openMenu}>
  <div class="top">
    <div class="avatar" use:fastclick on:fastclick={() => { $popout = {}; $popup = { id: "user", userId: member.id } }}>
      <div class="view-profile">View Profile</div>
      <Avatar user={member} size={80} />
    </div>
    <div class="icon" on:click|stopPropagation={openMenu}>more_vert</div>
  </div>
  <h3>{member.name || member.id}</h3>
  <div class="id">{member.id}</div>
</div>
