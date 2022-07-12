<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/room/Overview.svelte";
import Permissions from "../settings/room/Permissions.svelte";
import Emoji from "../settings/room/Emoji.svelte";

import Members from "../settings/room/Members.svelte";
import Bans from "../settings/room/Bans.svelte";
import Invites from "../settings/room/Invites.svelte";

let room = state.focusedRoom;

const views = [
  { view: Overview,      name: "Overview" },
  { view: Permissions,   name: "Permissions" },
  { view: Emoji,         name: "Emoji" },
  null,
  { view: Members,       name: "Members", raw: true },
  { view: Bans,          name: "Bans", raw: true },
  { view: Invites,       name: "Invites", raw: true },
  null,
  { clicked: () => state.popup.set({ id: "leave", type: "room", room: state.focusedRoomId, confirm: () => queueMicrotask(todo) }), name: "Leave Room", color: "var(--color-red)" },
];
</script>
<Settings {views} options={{ room }} />
