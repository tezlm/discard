<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/room/Overview.svelte";
import Permissions from "../settings/room/Permissions.svelte";
import Security from "../settings/room/Security.svelte";
import Integrations from '../settings/room/Integrations.svelte';
import Emoji from "../settings/room/Emoji.svelte";
import Members from "../settings/room/Members.svelte";

export let tab;
let room = state.selectedRoom;

$: views = [
  { id: "home/", label: `${$room.name}` },
  { id: "overview",     view: Overview,     name: "Overview",     icon: "info" },
  { id: "permissions",  view: Permissions,  name: "Permissions",  icon: "flag" },
  { id: "security",     view: Security,     name: "Security",     icon: "security" },
  { id: "integrations", view: Integrations, name: "Integrations", icon: "link" }, // maybe use `webhook`
  { id: "emoji",        view: Emoji,        name: "Emoji",        icon: "emoji_emotions" },
  { id: "usr/", split: true, label: "users" },
  { id: "members", view: Members,     name: "Members",     icon: "people",           raw: true, props: { membership: "join" }},
  { id: "bans",    view: Members,     name: "Bans",        icon: "person_remove",    raw: true, props: { membership: "ban" }},
  { id: "invites", view: Members,     name: "Invites",     icon: "person_add_alt_1", raw: true, props: { membership: "invite" }},
  { id: "etc/", split: true },
  { id: "leave", clicked: () => state.popup.set({ id: "leave", type: "room", room: $room }), name: "Leave Room", color: "var(--color-red)", icon: "logout" },
];
</script>
<Settings {views} options={{ room: $room, tab }} />
