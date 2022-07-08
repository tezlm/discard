<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/room/Overview.svelte";
import Permissions from "../settings/room/Permissions.svelte";

import Members from "../settings/room/Members.svelte";
import Bans from "../settings/room/Bans.svelte";
import Invites from "../settings/room/Invites.svelte";

import Archive from "../settings/room/Archive.svelte";

let origRoom = state.focusedRoom;
$: room = state.client.getRoom($origRoom?.roomId);

const views = [
  { view: Overview,      name: "Overview" },
  { view: Permissions,   name: "Permissions" },
  null,
  { view: Members,       name: "Members" },
  { view: Bans,          name: "Bans" },
  { view: Invites,       name: "Invites" },
  null,
  { clicked: () => state.popup.set({ id: "leave", type: "room", room: state.focusedRoomId, confirm: () => queueMicrotask(todo) }), name: "Leave Room", color: "var(--color-red)" },
];
</script>
<Settings {views} options={{ room }} />
