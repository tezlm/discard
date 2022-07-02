<script>
import Room from '../room/Room.svelte';
import RoomNav from '../nav/RoomNav.svelte';
import SpaceNav from '../nav/SpaceNav.svelte';
import SpaceHeader from '../space/SpaceHeader.svelte';
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
  <SpaceHeader/>
  <RoomNav/>
  <UserSettings/>
</div>
<Room/>
