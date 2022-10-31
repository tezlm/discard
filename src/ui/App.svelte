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
let { path, scene, context, popup, settings } = state;

// bezier code from https://gist.github.com/pushkine/fbc7cf18e0a40ffb02b3b3a20b74f4f1
// when will svelte add a builtin `bezier()` easing function ;-;
function bezier(x1, y1, x2, y2) {
	if (!(x1 >= 0 && x1 <= 1 && x2 >= 0 && x2 <= 1))
		throw new Error(`CubicBezier x1 & x2 values must be { 0 < x < 1 }, got { x1 : ${x1}, x2: ${x2} }`);
	const ax = 1.0 - (x2 = 3.0 * (x2 - x1) - (x1 *= 3.0)) - x1,
		ay = 1.0 - (y2 = 3.0 * (y2 - y1) - (y1 *= 3.0)) - y1;
	let i = 0, r = 0.0, s = 0.0, d = 0.0, x = 0.0;
	return (t) => {
		for (r = t, i = 0; 32 > i; i++)
			if (1e-5 > Math.abs((x = r * (r * (r * ax + x2) + x1) - t))) return r * (r * (r * ay + y2) + y1);
			else if (1e-5 > Math.abs((d = r * (r * ax * 3.0 + x2 * 2.0) + x1))) break;
			else r -= x / d;
		if ((s = 0.0) > (r = t)) return 0;
		else if ((d = 1.0) < r) return 1;
		while (d > s)
			if (1e-5 > Math.abs((x = r * (r * (r * ax + x2) + x1)) - t)) break;
			else t > x ? (s = r) : (d = r), (r = 0.5 * (d - s) + s);
		return r * (r * (r * ay + y2) + y1);
	};
};

function opacity() {
  return {
    duration: 500,
    easing: quadInOut,
    css: t => `opacity: ${t * 10}`,
  }
}

function ease() {
  return {
    duration: 250,
    easing: bezier(.59,.35,.71,1.22),
    css: t => $settings.get("reducemotion") ? `opacity: ${Math.min(t * 2, 1)}` : `opacity: ${Math.min(t * 2, 1)}; transform: scale(${1.125 - t / 8})`,
  }
}

function handleClick(e) {
  if ($context.items) {
    $context = {};
  } else if ($popup.id) {
    // $popup = { ...$popup, id: null };
  // } else if ($poput) {
    // $popup = {};
  }

  const ping = e.target.getAttribute("data-mx-ping");
  if (ping) {
    $popup = { id: "user", userId: ping };
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
    if (room) {
      actions.rooms.focus(room);
    }
  } else if (head === "home") {
    actions.spaces.focus(null);
    actions.rooms.focus(null);
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
  transition: transform 250ms cubic-bezier(.59,.35,.71,1.22);
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
  <div class="chat" class:hide={!["room", "space", "home"].includes($scene)} class:reducemotion={$settings.get("reducemotion")}><Chat /></div>
  {/if}
  {#if $scene === "user-settings"}
  <div class="settings" transition:ease><UserSettings tab={argv[0]} /></div>
  {:else if $scene === "space-settings"}
  <div class="settings" transition:ease><SpaceSettings tab={argv[1]} /></div>
  {:else if $scene === "room-settings"}
  <div class="settings" transition:ease><RoomSettings tab={argv[1]} /></div>
  {:else if $scene === "auth"}
  <LoginRegister />
  {:else if !["room", "space", "home"].includes($scene)}
  <div class="loading" transition:opacity><Loading /></div>
  {/if}
</main>
<div class="layer layer-1"><Popups /></div>
<div class="layer layer-2"><Popouts /></div>
<div class="layer layer-3"><ContextMenus /></div>
<svelte:window on:click={handleClick} />
