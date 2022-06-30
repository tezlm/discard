<script>
import Room from '../room/Room.svelte';
import RoomNav from '../nav/RoomNav.svelte';
import SpaceNav from '../nav/SpaceNav.svelte';
import UserSettings from '../UserSettings.svelte';
</script>
<style>
.nav {
  display: flex;
  flex-direction: column;
}
</style>
<SpaceNav/>
<div class="nav">
  <RoomNav/>
  <UserSettings/>
</div>
<Room/>
