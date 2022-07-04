<script>
import Settings from '../settings/Settings.svelte';

import Overview from "../settings/room/Overview.svelte";
import Permissions from "../settings/room/Permissions.svelte";

import Members from "../settings/room/Members.svelte";
import Bans from "../settings/room/Bans.svelte";
import Invites from "../settings/room/Invites.svelte";

import Archive from "../settings/room/Archive.svelte";

const views = [
  { view: Overview,      name: "Overview" },
  { view: Permissions,   name: "Permissions" },
  null,
  { view: Members,       name: "Members" },
  { view: Bans,          name: "Bans" },
  { view: Invites,       name: "Invites" },
  null,
  { view: Archive,       name: "Archive Room" },
];
</script>
<Settings {views} />
