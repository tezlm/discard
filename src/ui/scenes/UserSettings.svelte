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
  { view: Account,       name: "My Account" },
  { view: PrivSec,       name: "Privacy and Security" },
  { view: Homeserver,    name: "Homeserver" },
  { view: Nitor,         name: "Nitor", color: "#ff73fa", raw: true },
  null,
  { view: Appearance,    name: "Appearance" },
  { view: TextImages,    name: "Text and Images" },
  { view: RoomsSpaces,   name: "Rooms and Spaces" },
  { view: Notifications, name: "Notifications" },
  { view: Keybinds,      name: "Keybinds" },
  { view: null,          name: "Language" },
  null,
  { view: Testbed,       name: "Testbed" },
  { view: Changelog,     name: "Changelog" },
  { view: Help,          name: "Help" },
  { view: Version,       name: "Credits" },
  null,
  { name: "Log Out", color: "var(--color-red)", clicked: () => state.popup.set({ id: "logout", confirm: actions.client.logout }) },
];
</script>
<Settings {views} />