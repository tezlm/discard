<script>
import Settings from '../settings/Settings.svelte';

import Account from '../settings/user/Account.svelte';
import PrivSec from '../settings/user/PrivacySecurity.svelte';
import Homeserver from '../settings/user/Homeserver.svelte';
import Appearance from '../settings/user/Appearance.svelte';
import Notifications from '../settings/user/Notifications.svelte';

const views = [
  { view: Account,       name: "My Account" },
  { view: PrivSec,       name: "Privacy and Security" },
  { view: Homeserver,    name: "Homeserver" },
  null,
  { view: Appearance,    name: "Appearance" },
  { view: Notifications, name: "Notifications" },
];
</script>
<Settings {views} />