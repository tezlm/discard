<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/room/Overview.svelte";
import Permissions from "../settings/room/Permissions.svelte";
import Security from "../settings/room/Security.svelte";
import Integrations from '../settings/room/Integrations.svelte';
import Emoji from "../settings/room/Emoji.svelte";
import Members from "../settings/room/Members.svelte";

let room = state.selectedRoom;

const views = [
  { view: Overview,     name: "Overview",     icon: "info" },
  { view: Permissions,  name: "Permissions",  icon: "flag" },
  { view: Security,     name: "Security",     icon: "security" },
  { view: Integrations, name: "Integrations", icon: "link" },
  { view: Emoji,        name: "Emoji",        icon: "emoji_emotions" },
  null,
  { view: Members,      name: "Members",      icon: "people",           raw: true, props: { membership: "join" }},
  { view: Members,      name: "Bans",         icon: "person_remove",    raw: true, props: { membership: "ban" }},
  { view: Members,      name: "Invites",      icon: "person_add_alt_1", raw: true, props: { membership: "invite" }},
  null,
  { clicked: () => state.popup.set({ id: "leave", type: "room", room: $room }), name: "Leave Room", color: "var(--color-red)", icon: "logout" },
];
</script>
<Settings {views} options={{ room }} />
