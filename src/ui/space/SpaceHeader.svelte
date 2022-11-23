<script>
import { quadOut } from "svelte/easing";
import { roomContext, homeContext } from "../../util/context";
let { focusedSpace, context, popup } = state;
let showMenu = false;

function zoomIn() {
  return {
    duration: 100,
    easing: quadOut,
    css: t => `transform: scale(${t})`,
  }
}

function showPopup(id, opts) {
  $popup = { id, type: "space", ...opts }; 
}
</script>
<style>
.header {
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 16px;
  height: 48px;

  font-weight: 700;
  box-shadow: var(--shadow-header);
  cursor: pointer;
  user-select: none;  
  
  transition: background .2s;
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header:hover, .header.showMenu {
  background: var(--mod-lighten);
}

.menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 220px;
  margin: 10px;
  padding: 6px 8px;

  transform-origin: top center;

  background: var(--bg-context);
  border-radius: 4px;
  box-shadow: var(--shadow-popup);
  z-index: 10;
}

.menu .item {
  padding: 6px 8px;
  border-radius: 2px;
  cursor: pointer;
  color: var(--fg-interactive);
  font-size: 14px;
  font-weight: 500;
  min-height: 32px;
  margin: 2px 0;
}

.menu .item:hover {
  background: var(--color-accent);
  color: #fff;
}

.menu .item:hover > span {
  color: #fff;
}

.menu .spacer {
  height: 1px;
  width: 196px;
  margin: 5px auto;
  background: var(--bg-misc);
}

.color-accent {
  color: var(--color-accent);
}

.color-red {
  color: var(--color-red);
}

.header > .icon {
  margin-left: auto;
  margin-right: -8px;
  color: var(--fg-interactive);
  font-size: 22px;
  height: 32px;
  width: 32px;
  transition: all 150ms;
}

.item .icon {
  float: right;
  font-size: 16px;
}
</style>
<div
  class="header"
  class:showMenu
  on:click={() => showMenu = !showMenu}
  on:contextmenu|preventDefault|stopPropagation={e => $context = { items: $focusedSpace ? roomContext($focusedSpace) : homeContext(), x: e.clientX, y: e.clientY }}
>
  {#if $focusedSpace}
    <span class="name" title={$focusedSpace?.name ?? "unknown"}>{$focusedSpace?.name ?? "unknown"}</span>
    <span class="icon" style:transform={showMenu ? "rotate(180deg)" : "rotate(0deg)"}>expand_more</span>
  {:else}
    <span>Home</span>
  {/if}
  {#if showMenu}
  <div class="menu" transition:zoomIn>
  {#if $focusedSpace}
      {#if $focusedSpace.power.me >= ($focusedSpace.power.invite ?? 0) || $focusedSpace.joinRule === "public"}
      <div class="item" on:click={() => showPopup("invite", { room: $focusedSpace })}><span class="color-accent">Invite People</span><span class="color-accent icon">person_add</span></div>
      <div class="spacer"></div>
      {/if}
      <div class="item" on:click={() => { state.selectedRoom.set($focusedSpace); actions.to(`/space-settings/${$focusedSpace.id}`) }}>Space Settings<span class="icon">settings</span></div>
      <div class="item" on:click={todo}>Notification Settings<span class="icon">notifications</span></div>
      <div class="spacer"></div>
      {#if $focusedSpace.power.me >= $focusedSpace.power.forState("m.space.child")}
      <div class="item" on:click={() => showPopup("create", { type: "room", parent: $focusedSpace })}>Create Room<span class="icon">tag</span></div>
      <div class="item" on:click={() => showPopup("create", { type: "space", parent: $focusedSpace })}>Create Subspace<span class="icon">folder</span></div>
      <div class="item" on:click={() => showPopup("addexisting", { parent: $focusedSpace })}>Add Existing Room<span class="icon">add</span></div>
      <div class="spacer"></div>
      {/if}
      <div class="item" on:click={() => showPopup("leave", { room: $focusedSpace })}><span class="color-red">Leave Space</span><span class="color-red icon">logout</span></div>
  {:else}
      <div class="item" on:click={() => showPopup("create", { type: "room" })}>Create Room<span class="icon">tag</span></div>
      <div class="item" on:click={() => showPopup("create", { type: "space" })}>Create Space<span class="icon">folder</span></div>
      <div class="item" on:click={() => showPopup("join")}>Join<span class="icon">add</span></div>
      <div class="spacer"></div>
      <div class="item" on:click={() => actions.to("/user-settings") }>Settings<span class="icon">settings</span></div>
  {/if}
  </div>
  {/if}
</div>
