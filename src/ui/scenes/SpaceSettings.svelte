<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/space/Overview.svelte";
import Rooms from "../settings/space/Rooms.svelte";
import Permissions from "../settings/room/Permissions.svelte";
import Audit from "../settings/space/Audit.svelte";

import Members from "../settings/room/Members.svelte";
import Bans from "../settings/room/Bans.svelte";
import Invites from "../settings/room/Invites.svelte";

let spaceId = state.focusedSpace;
$: room = state.client.getRoom($spaceId);

const views = [
  { view: Overview,      name: "Overview", display: "Space Overview" },
  { view: Rooms,         name: "Rooms" },
  { view: Permissions,   name: "Permissions" },
  { view: Audit,         name: "Audit Log" },
  null,
  { view: Members,       name: "Members" },
  { view: Bans,          name: "Bans" },
  { view: Invites,       name: "Invites" },
];
</script>
<Settings {views} options={{ room }} />