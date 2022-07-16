<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/space/Overview.svelte";
import Rooms from "../settings/space/Rooms.svelte";
import Permissions from "../settings/room/Permissions.svelte";
import Audit from "../settings/space/Audit.svelte";
import Emoji from "../settings/room/Emoji.svelte";
import Members from "../settings/room/Members.svelte";

let room = state.selectedRoom;

const views = [
  { view: Overview,    name: "Overview", raw: true },
  { view: Rooms,       name: "Rooms" },
  { view: Permissions, name: "Permissions" },
  { view: Audit,       name: "Audit Log" },
  { view: Emoji,       name: "Emoji" },
  null,
  { view: Members,     name: "Members", raw: true, props: { membership: "join" }},
  { view: Members,     name: "Bans",    raw: true, props: { membership: "ban" }},
  { view: Members,     name: "Invites", raw: true, props: { membership: "invite" }},
  null,
  { clicked: () => state.popup.set({ id: "leave", type: "space", room: $room, confirm: () => queueMicrotask(todo) }), name: "Leave Space", color: "var(--color-red)" },
];
</script>
<Settings {views} options={{ room }} />