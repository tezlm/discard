<script>
import Power from "../../atoms/Power.svelte";
export let room;
$: perms = $room.power;

let modified = new Set();
let isModified = false;

const descriptions = {
  message:  "The minimum power required to send messages.",
  reaction: "The minimum power required to add reactions to messages. Unlike discord, disabling this permission will also disallow reacting with existing reactions.",
  ban:      `The minimum power required to remove other (lower-powered) members from this ${$room.type}. Bans last forever, or until an unban.`,
  kick:     `The minimum power required to remove other (lower-powered) members from this ${$room.type}. Kicked members can rejoin with an invite ${$room.joinRule === "public" ? "or a link." : ""}`,
  invite:   `The minimum power required to invite new people to this ${$room.type}.`,
  redact:   "The minimum power required to remove messages.",
  name:     `The minimum power required to change this ${$room.type}'s name.`,
  topic:    `The minimum power required to change this ${$room.type}'s topic.`,
  power:    "The minimum power required to change other people's power levels.",
  perms:    "The minimum power required to change these minimum power levels.",
  default:  "Everyone's default power level.",
  ping:     "The minimum power required to ping everyone. Set this to something high if this room is public.",
};

function getItems() {
  return [
    { category: "Basic permissions" },
    { name: "Send Messages",   id: "message",  power: perms.getEvent("m.room.message") },
    { name: "Add Reactions",   id: "reaction", power: perms.getEvent("m.room.reaction") },
    { name: "Redact Messages", id: "redact",   power: perms.redact ?? 0 },
    { category: "Membership permissions" },
    { name: "Ban Members",     id: "ban",      power: perms.ban ?? 50 },
    { name: "Kick Members",    id: "kick",     power: perms.kick ?? 50 },
    { name: "Invite Users",    id: "invite",   power: perms.invite ?? 0 },
    { category: "Room permissions" },
    { name: "Change Name",     id: "name",     power: perms.getState("m.room.name") },
    { name: "Change Topic",    id: "topic",    power: perms.getState("m.room.topic") },
    { category: "Permission permissions" },
    { name: "Manage Power",    id: "power",    power: perms.getState("m.room.power_levels") },
    { name: "Change Power",    id: "perms",    power: perms.getState("m.room.name") },
    { name: "Default Power",   id: "default",  power: perms.users_default ?? 0 },
    { category: "Misc permissions" },
    { name: "Ping Room",       id: "ping",     power: perms.notifications?.room ?? perms.state_default ?? 50 },
  ];
}
</script>
<style>
.item {
  display: flex;
  margin: 8px 0;
  padding: 8px 0;
  border-bottom: solid var(--color-gray) 1px;
}

.title {
  color: var(--fg-notice);
  font-weight: 500;
  font-size: 16px;
}

.description {
  margin-top: 8px;
  color: var(--fg-light);
  font-size: 14px;
}

.category {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--fg-light);
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
}
</style>
{#if perms}
{#each getItems() as item}
{#if item.category}
  <h3 class="category">{item.category}</h3>
{:else}
  <div class="item">
    <div>
      <h5 class="title">{item.name}</h5>
      <div class="description">{descriptions[item.id]}</div>
    </div>
    <div style="margin-left: auto">
      <Power
        value={item.power}
        disabled={perms.me < perms.getState("m.room.power_levels")}
        changed={(p) => { modified[item.power === p ? "delete" : "add"](item.id); isModified = modified.size }}
      />
    </div>
  </div>
{/if}
{/each}
<br>
<b>useful in other clients but not (currently?) here</b>
<p style="user-select: none;">should i keep them?</p>
<p>change room avatar: {perms.getState("m.room.avatar")}</p>
<p>upgrade room: {perms.getState("m.room.tombstone")}</p>
<p>change history visibility: {perms.getState("m.room.history_visibility")}</p>
<p>enable encryption: {perms.getState("m.room.encryption")}</p>
{#if isModified}
  <!--
    "careful you have unsaved changes"
    TODO: reset, prevent leaving if unsaved changes
  -->
{/if}
{:else}
<p>permissions failed to load!</p>
{/if}
