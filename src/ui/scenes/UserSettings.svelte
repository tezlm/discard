<script>
import Settings from '../settings/Settings.svelte';

import Account from '../settings/user/Account.svelte';
import PrivSec from '../settings/user/PrivacySecurity.svelte';
import Homeserver from '../settings/user/Homeserver.svelte';
import Nitor from '../settings/user/Nitor.svelte';

import Appearance from '../settings/user/Appearance.svelte';
import TextImages from '../settings/user/TextImages.svelte';
import RoomsSpaces from '../settings/user/RoomsSpaces.svelte';
import Notifications from '../settings/user/Notifications.svelte';
import Keybinds from '../settings/user/Keybinds.svelte';
// Language

import Changelog from '../settings/user/Changelog.svelte';
import Help from '../settings/user/Help.svelte';
import Version from '../settings/user/Version.svelte';
import Testbed from '../settings/user/Testbed.svelte'; // temporary

const views = [
  { view: Account,       name: "My Account",           icon: "account_circle" },
  { view: PrivSec,       name: "Privacy and Security", icon: "security" },
  { view: Homeserver,    name: "Homeserver",           icon: "storage" },
  { view: Nitor,         name: "Nitor",                icon: "paid",  color: "#ff73fa", raw: true },
  null,
  { view: Appearance,    name: "Appearance",           icon: "palette" },
  { view: TextImages,    name: "Text and Images",      icon: "message" },
  { view: RoomsSpaces,   name: "Rooms and Spaces",     icon: "grid_3x3" },
  { view: Notifications, name: "Notifications",        icon: "notifications" },
  { view: Keybinds,      name: "Keybinds",             icon: "keyboard" },
  { view: null,          name: "Language",             icon: "language" },
  null,
  { view: Testbed,       name: "Testbed",              icon: "code" },
  { view: Changelog,     name: "Changelog",            icon: "assignment" },
  { view: Help,          name: "Help",                 icon: "help" },
  { view: Version,       name: "Credits",              icon: "groups" },
  null,
  { name: "Log Out", color: "var(--color-red)", clicked: () => state.popup.set({ id: "logout", confirm: actions.client.logout }), icon: "logout" },
];
</script>
<Settings {views} />