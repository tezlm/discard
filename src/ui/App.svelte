<script>
import Loading from "./scenes/Loading.svelte";
import Chat from "./scenes/Chat.svelte";
import LoginRegister from "./scenes/LoginRegister.svelte";
import UserSettings from "./scenes/UserSettings.svelte";
import SpaceSettings from "./scenes/SpaceSettings.svelte";
import RoomSettings from "./scenes/RoomSettings.svelte";
import Popups from "./Popups.svelte";
import Popouts from "./Popouts.svelte";
import ContextMenus from "./ContextMenus.svelte";
import { quadInOut } from "svelte/easing";
import { bezier } from "../util/bezier";
let { path, scene, context, popup, popout, settings, focusedRoom, selectedRoom } = state;

function opacity() {
  return {
    duration: 500,
    easing: quadInOut,
    css: t => `opacity: ${t * 10}`,
  }
}

function ease() {
  return {
    duration: 350,
    easing: bezier(.42, .1, .44, 1.29),
    css: t => $settings.get("reducemotion") ? `opacity: ${Math.min(t * 2, 1)}` : `opacity: ${Math.min(t * 2, 1)}; transform: scale(${1.125 - t / 8})`,
  }
}

function handleClick(e) {
  const ping = e.target.dataset?.mxPing;
  if ($context.items) {
    $context = {};
  } else if (ping) {
    if (e.target === $popout._owner) return $popout = {};
    const room = $scene.endsWith("-settings") ? $selectedRoom : $focusedRoom;
    const member = room.members.get(ping);
    if (!member && ping !== "room") return;
    const rect = e.target.getBoundingClientRect();
    const right = (rect.x + rect.width) > (window.innerWidth - 300);
    $popout = {
      id: "member",
      member: ping === "room" ? room : member,
      animate: right ? "left" : "right",
      top: rect.y,
      ...(right ? { right: window.innerWidth - rect.x + 8 } : { left: rect.x + rect.width + 8 }),
      _owner: e.target,
    };
  } else if ($popout.id) {
    $popout = {};
  }
}

$: state.log.ui("switch scene to " + $scene);
let argv = [];
$: {
  location.hash = "#" + $path;
  const [head, ...newArgv] = $path.split("/").slice(1);
  argv = newArgv;
  $scene = head;
  
  if (head === "space") {
    const space = state.rooms.get(argv[0]);
    if (space) {
      actions.spaces.focus(space);
      actions.rooms.focus(null);
    }
  } else if (head === "room" && state.focusedRoomId !== argv[0]) {
    const room = state.rooms.get(argv[0]);
    if (room) actions.rooms.focus(room);
  } else if (head === "home" || head === "invites") {
    if (state.focusedSpaceId) actions.spaces.focus(null);
    if (state.focusedRoomId) actions.rooms.focus(null);
  }
}
</script>
<style>
main {
  display: flex;
  height: 100vh;
}

main > div {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
}

.chat {
  transition: transform 350ms cubic-bezier(.42, .1, .44, 1.29);
}

.chat.hide {
  transform: scale(0.875);
}

.chat.hide.reducemotion {
  transform: none;
}

.settings { z-index: 1 }
.loading { z-index: 2 }

.layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.layer.layer-1 { z-index: 10; }
.layer.layer-2 { z-index: 20; }
.layer.layer-3 { z-index: 30; }
</style>
<main>
  {#if $scene !== "auth"}
  <div class="chat" class:hide={!["room", "space", "home", "invites"].includes($scene)} class:reducemotion={$settings.get("reducemotion")}><Chat /></div>
  {/if}
  {#if $scene === "user-settings"}
  <div class="settings" transition:ease><UserSettings tab={argv[0]} /></div>
  {:else if $scene === "space-settings"}
  <div class="settings" transition:ease><SpaceSettings tab={argv[1]} /></div>
  {:else if $scene === "room-settings"}
  <div class="settings" transition:ease><RoomSettings tab={argv[1]} /></div>
  {:else if $scene === "auth"}
  <LoginRegister />
  {:else if !["room", "space", "home", "invites"].includes($scene)}
  <div class="loading" out:opacity><Loading /></div>
  {/if}
</main>
<div class="layer layer-1"><Popouts /></div>
<div class="layer layer-2"><Popups /></div>
<div class="layer layer-3"><ContextMenus /></div>
<svelte:window on:click={handleClick} />
