<script>
import Settings from '../settings/Settings.svelte';

import Account from '../settings/user/Account.svelte';
import PrivSec from '../settings/user/PrivacySecurity.svelte';
import Homeserver from '../settings/user/Homeserver.svelte';
import Nitor from '../settings/user/Nitor.svelte';

import Appearance from '../settings/user/Appearance.svelte';
import Notifications from '../settings/user/Notifications.svelte';
import Testbed from '../settings/user/Testbed.svelte'; // temporary

import Changelog from '../settings/user/Changelog.svelte';
import Help from '../settings/user/Help.svelte';

const views = [
  { view: Account,       name: "My Account" },
  { view: PrivSec,       name: "Privacy and Security" },
  { view: Homeserver,    name: "Homeserver" },
  { view: Nitor,         name: "Nitor", color: "#ff73fa", raw: true },
  null,
  { view: Appearance,    name: "Appearance" },
  { view: Notifications, name: "Notifications" },
  { view: Testbed,       name: "Testbed" },
  null,
  { view: Changelog,     name: "Changelog" },
  { view: Help,          name: "Help" },
  null,
  { name: "Log Out", color: "var(--color-red)", clicked: () => state.popup.set({ id: "logout", confirm: actions.client.logout }) },
];
</script>
<Settings {views} />