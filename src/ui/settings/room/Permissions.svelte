<script>
export let room;
$: perms = $room.power;

const getEventPerm = (name) => perms.events?.[name] ?? perms.events_default;
const getStatePerm = (name) => perms.events?.[name] ?? perms.state_default;
const getBasePerm = (name) => perms[name] ?? perms.state_default;
</script>
<style>
p {
  user-select: text;
}
</style>
{#if perms}
<p>user default: {perms.users_default}</p>
<p>send messages: {getEventPerm("m.room.message")}</p>
<p>send reactions: {getEventPerm("m.room.reaction")}</p>
<p>ban: {getBasePerm("ban")}</p>
<p>kick: {getBasePerm("kick")}</p>
<p>redact: {getBasePerm("redact")}</p>
<p>invite: {getBasePerm("invite")}</p>
<p>change room name: {getStatePerm("m.room.name")}</p>
<p>change room topic: {getStatePerm("m.room.topic")}</p>
<p>change room name: {getStatePerm("m.room.name")}</p>
<p>change power levels: {getStatePerm("m.room.power_levels")}</p>
<br>
<b>useful in other clients but not (currently?) here</b>
<p style="user-select: none;">should i keep them?</p>
<p>change room avatar: {getStatePerm("m.room.avatar")}</p>
<p>upgrade room: {getStatePerm("m.room.tombstone")}</p>
<p>change history visibility: {getStatePerm("m.room.history_visibility")}</p>
<p>enable encryption: {getStatePerm("m.room.encryption")}</p>
{:else}
<p>permissions failed to load!</p>
{/if}
