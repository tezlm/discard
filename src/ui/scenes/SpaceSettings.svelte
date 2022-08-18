<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/space/Overview.svelte";
import Permissions from "../settings/room/Permissions.svelte";
import Security from "../settings/room/Security.svelte";
import Rooms from "../settings/space/Rooms.svelte";
// import Audit from "../settings/space/Audit.svelte";
// import Emoji from "../settings/room/Emoji.svelte";
import Members from "../settings/room/Members.svelte";

let room = state.selectedRoom;

const views = [
  { view: Overview,    name: "Overview",    icon: "info", raw: true },
  { view: Permissions, name: "Permissions", icon: "flag" },
  { view: Security,    name: "Security",    icon: "security" },
  { view: Rooms,       name: "Rooms",       icon:"tag" },
  // { view: Audit,       name: "Audit Log",   icon: "assignment" },
  // { view: Emoji,       name: "Emoji",       icon: "emoji_emotions" },
  null,
  { view: Members,     name: "Members",     icon: "people",           raw: true, props: { membership: "join" }},
  { view: Members,     name: "Bans",        icon: "person_remove",    raw: true, props: { membership: "ban" }},
  { view: Members,     name: "Invites",     icon: "person_add_alt_1", raw: true, props: { membership: "invite" }},
  null,
  { clicked: () => state.popup.set({ id: "leave", type: "space", room: $room, confirm: () => queueMicrotask(todo) }), name: "Leave Space", color: "var(--color-red)", icon: "logout" },
];
</script>
<Settings {views} options={{ room }} />