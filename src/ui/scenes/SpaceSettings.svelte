<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/space/Overview.svelte";
import Permissions from "../settings/room/Permissions.svelte";
import Security from "../settings/room/Security.svelte";
import Rooms from "../settings/space/Rooms.svelte";
import Audit from "../settings/space/Audit.svelte";
import Emoji from "../settings/room/Emoji.svelte";
import Members from "../settings/room/Members.svelte";

export let tab;
let room = state.selectedRoom;
let { settings } = state;

$: emoji = $settings.get("ex-emoji") ? [{ id: "emoji", view: Emoji, name: "Emoji and Stickers", icon: "emoji_emotions" }] : [];

$: views = [
  { id: "home/", label: `${$room.name}` },
  { id: "overview",    view: Overview,    name: "Overview",           icon: "info", raw: true },
  { id: "permissions", view: Permissions, name: "Permissions",        icon: "flag" },
  { id: "security",    view: Security,    name: "Security",           icon: "security" },
  { id: "rooms",       view: Rooms,       name: "Rooms",              icon:"tag" },
  { id: "audit",       view: Audit,       name: "Audit Log",          icon: "assignment" },
  ...emoji,
  { id: "usr/", split: true, label: "users" },
  { id: "members", view: Members,     name: "Members",     icon: "people",           raw: true, props: { membership: "join" }},
  { id: "bans",    view: Members,     name: "Bans",        icon: "person_remove",    raw: true, props: { membership: "ban" }},
  { id: "invites", view: Members,     name: "Invites",     icon: "person_add_alt_1", raw: true, props: { membership: "invite" }},
  { id: "etc/", split: true },
  { id: "leave", clicked: () => state.popup.set({ id: "leave", type: "space", room: $room }), name: "Leave Space", color: "var(--color-red)", icon: "logout" },
];
</script>
<Settings {views} options={{ room: $room, tab }} />
