<script>
import Settings from '../settings/Settings.svelte';

import Account from '../settings/user/Account.svelte';
import PrivSec from '../settings/user/PrivacySecurity.svelte';
import Homeserver from '../settings/user/Homeserver.svelte';

import Appearance from '../settings/user/Appearance.svelte';
import TextImages from '../settings/user/TextImages.svelte';
import RoomsSpaces from '../settings/user/RoomsSpaces.svelte';
import Notifications from '../settings/user/Notifications.svelte';
import Keybinds from '../settings/user/Keybinds.svelte';
import Language from '../settings/user/Language.svelte';
// Language

import Changelog from '../settings/user/Changelog.svelte';
import Help from '../settings/user/Help.svelte';
import Version from '../settings/user/Version.svelte';
import Testbed from '../settings/user/Testbed.svelte'; // temporary
import Shadow from '../settings/user/Shadow.svelte';

let { settings } = state;

$: shadow  = $settings.get("shadowsettings") ? [{ id: "shadow", view: Shadow,  name: "Shadow Settings", color: "#a76ee5", icon: "circle", raw: true }] : [];
$: testbed = $settings.get("shadowtest")     ? [{ id: "test", view: Testbed, name: "Testbed", icon: "code" }] : [];

$: views = [
  { id: "/home", label: "Account" },
  { id: "account",    view: Account,       name: "My Account",           icon: "account_circle" },
  { id: "privsec",    view: PrivSec,       name: "Privacy and Security", icon: "security" },
  { id: "homeserver", view: Homeserver,    name: "Homeserver",           icon: "storage" },
  { id: "/config", split: true, label: "App Settings" },
  { id: "appearance",    view: Appearance,    name: "Appearance",           icon: "palette" },
  { id: "text-images",   view: TextImages,    name: "Text and Images",      icon: "message" },
  { id: "rooms-spaces",  view: RoomsSpaces,   name: "Rooms and Spaces",     icon: "grid_3x3" },
  { id: "notifications", view: Notifications, name: "Notifications",        icon: "notifications" },
  { id: "keybinds",      view: Keybinds,      name: "Keybinds",             icon: "keyboard" },
  { id: "language",      view: Language,      name: "Language",             icon: "language" },
  ...shadow,
  { id: "/info", split: true, label: "Info" },
  ...testbed,
  { id: "changelog", view: Changelog,     name: "Changelog",            icon: "assignment" },
  { id: "help",      view: Help,          name: "Help",                 icon: "help" },
  { id: "version",   view: Version,       name: "Credits",              icon: "groups" },
  { id: "/etc", split: true },
  { id: "logout", name: "Log Out", color: "var(--color-red)", clicked: () => state.popup.set({ id: "logout", confirm: actions.client.logout }), icon: "logout" },
];
</script>
<Settings {views} />