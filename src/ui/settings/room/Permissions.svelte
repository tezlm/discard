<script>
export let room;
$: perms = $room.power;
</script>
<style>
p {
  user-select: text;
}
</style>
{#if perms}
<p>user default: {perms.users_default ?? 0}</p>
<p>send messages: {perms.getEvent("m.room.message")}</p>
<p>send reactions: {perms.getEvent("m.room.reaction")}</p>
<p>ban: {perms.ban ?? 50}</p>
<p>kick: {perms.kick ?? 50}</p>
<p>redact: {perms.redact ?? 50}</p>
<p>invite: {perms.invite ?? 0}</p>
<p>change room name: {perms.getState("m.room.name")}</p>
<p>change room topic: {perms.getState("m.room.topic")}</p>
<p>change room name: {perms.getState("m.room.name")}</p>
<p>change power levels: {perms.getState("m.room.power_levels")}</p>
<br>
<b>useful in other clients but not (currently?) here</b>
<p style="user-select: none;">should i keep them?</p>
<p>change room avatar: {perms.getState("m.room.avatar")}</p>
<p>upgrade room: {perms.getState("m.room.tombstone")}</p>
<p>change history visibility: {perms.getState("m.room.history_visibility")}</p>
<p>enable encryption: {perms.getState("m.room.encryption")}</p>
{:else}
<p>permissions failed to load!</p>
{/if}
