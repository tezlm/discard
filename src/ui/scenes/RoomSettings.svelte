<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/room/Overview.svelte";
import Permissions from "../settings/room/Permissions.svelte";
import Emoji from "../settings/room/Emoji.svelte";
import Members from "../settings/room/Members.svelte";

let room = state.focusedRoom;

const views = [
  { view: Overview,    name: "Overview" },
  { view: Permissions, name: "Permissions" },
  { view: Emoji,       name: "Emoji" },
  null,
  { view: Members,     name: "Members", raw: true, props: { membership: "join" }},
  { view: Members,     name: "Bans",    raw: true, props: { membership: "ban" }},
  { view: Members,     name: "Invites", raw: true, props: { membership: "invite" }},
  null,
  { clicked: () => state.popup.set({ id: "leave", type: "room", room: $room, confirm: () => queueMicrotask(todo) }), name: "Leave Room", color: "var(--color-red)" },
];
</script>
<Settings {views} options={{ room }} />
