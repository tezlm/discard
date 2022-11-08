<script>
import Avatar from "../atoms/Avatar.svelte";
import { memberContext, roomContext } from "../../util/context";
import { fastclick } from "../../util/use";
import { Room, Member } from "discount.js";
export let member;
let { popup, popout, context } = state;
$: isRoomPing = member instanceof Room;

// RENAME: Member instead of User

function openMenu(e) {
  if (!isRoomPing || !member instanceof Member) return;
  $context = { items: isRoomPing ? roomContext(member) : memberContext(member), x: e.clientX, y: e.clientY };
}
</script>
<style>
.popout {
  width: 300px;
  padding: 16px;
  background: var(--bg-context);
  border-radius: 8px;
  box-shadow: var(--shadow-popup);
  overflow: hidden;
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
  overflow: hidden;
  text-overflow: ellipsis;
}

.popout .id {
  color: var(--fg-muted);
  font-size: 14px;
  user-select: all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.info {
  margin: -16px;
  margin-top: 8px;
  padding: 16px;
  background: var(--bg-spaces);
  color: var(--fg-dim);
}
</style>
<div class="popout" on:click|stopPropagation={() => $context = {}} on:contextmenu|preventDefault|stopPropagation={openMenu}>
  <div class="top">
    {#if isRoomPing}
    <Avatar link user={member} size={80} />
    {:else}
    <div class="avatar" use:fastclick on:fastclick={() => { $popout = {}; $context = {}; $popup = { id: "user", userId: member.id } }}>
      <div class="view-profile">View Profile</div>
      <Avatar user={member} size={80} />
    </div>
    {/if}
    <div class="icon" on:click|stopPropagation={openMenu}>more_vert</div>
  </div>
  <h3>{member.name || member.id}</h3>
  <div class="id">{member.id}</div>
  {#if isRoomPing}
  <div class="info">
    Ah, the humble <span data-mx-ping="room">@room</span>, which mentions everyone in a room. Similar to <span style="background: white; color: black; font-weight: bold; padding: 0 4px; border-radius: 12px; cursor: pointer">@all</span> or <span data-mx-ping>@everyone</span> in other platforms.
  </div>
  {:else}
  <br />
  This person has a power level of <code>{member.power}</code>.
  {/if}
</div>
