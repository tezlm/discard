<script>
import Power from "../../atoms/Power.svelte";
import Confirm from "../Confirm.svelte";
export let room;
export let save;
$: perms = $room.power;

// TODO: live update, make this not suck as much

let modified = new Map();
let isModified = false;

const descriptions = {
  message:  "The minimum power required to send messages.",
  reaction: "The minimum power required to add reactions to messages. Unlike discord, disabling this permission will also disallow reacting with existing reactions.",
  invite:   `The minimum power required to invite new people to this ${$room.type}.`,
  kick:     `The minimum power required to remove other (lower-powered) members from this ${$room.type}. Kicked members can rejoin with an invite ${$room.joinRule === "public" ? "or a link." : ""}`,
  ban:      `The minimum power required to remove other (lower-powered) members from this ${$room.type}. Bans last forever, or until an unban.`,
  redact:   "The minimum power required to remove messages.",
  name:     `The minimum power required to change this ${$room.type}'s name.`,
  topic:    `The minimum power required to change this ${$room.type}'s topic.`,
  avatar:   `The minimum power required to change this ${$room.type}'s avatar.`,
  power:    "The minimum power required to change these permissions and other people's power levels.",
  // perms:    "The minimum power required to change these minimum power levels.",
  default:  "Everyone's default power level.",
  ping:     "The minimum power required to ping everyone. Set this to something high if this room is public.",
  rooms:    "The minimum power required to add/remove rooms to this space.",
  history:  "The minimum power required to change history visibility",
  encrypt:  "The minimum power required to enable end to end encryption",
};

function getItems() {
  if ($room.type === "m.space") {
    return [
      { category: "Room list permissions" },
      { name: "Manage Rooms",    id: "rooms",    power: perms.getState("m.space.child") },
      { category: "Membership permissions" },
      { name: "Invite Users",    id: "invite",   power: perms.invite ?? 0 },
      { name: "Kick Members",    id: "kick",     power: perms.kick ?? 50 },
      { name: "Ban Members",     id: "ban",      power: perms.ban ?? 50 },
      { category: "Space profile permissions" },
      { name: "Change Name",     id: "name",     power: perms.getState("m.room.name") },
      { name: "Change Topic",    id: "topic",    power: perms.getState("m.room.topic") },
      { name: "Change Avatar",   id: "avatar",   power: perms.getState("m.room.avatar") },
      { category: "Permission permissions" },
      { name: "Default Power",   id: "default",  power: perms.users_default ?? 0 },
      { name: "Manage Power",    id: "power",    power: perms.getState("m.room.power_levels") },
      // { name: "Manage Settings", id: "perms",    power: perms.state_default ?? 50 },
      { category: "????" },
      { name: "Upgrade Room",    id: "upgrade",  power: perms.getState("m.room.tombstone") },
      { name: "History",         id: "history",  power: perms.getState("m.room.history_visibility") },
      { name: "Encrypt",         id: "encrypt",  power: perms.getState("m.room.encryption") },
    ];
  } else {
    return [
      { category: "Basic permissions" },
      { name: "Send Messages",   id: "message",  power: perms.events_default ?? 0 },
      { name: "Add Reactions",   id: "reaction", power: perms.getEvent("m.room.reaction") },
      { name: "Redact Messages", id: "redact",   power: perms.redact ?? 0 },
      { name: "Ping Room",       id: "ping",     power: perms.notifications?.room ?? perms.state_default ?? 50 },
      { category: "Membership permissions" },
      { name: "Invite Users",    id: "invite",   power: perms.invite ?? 0 },
      { name: "Kick Members",    id: "kick",     power: perms.kick ?? 50 },
      { name: "Ban Members",     id: "ban",      power: perms.ban ?? 50 },
      { category: "Room profile permissions" },
      { name: "Change Name",     id: "name",     power: perms.getState("m.room.name") },
      { name: "Change Topic",    id: "topic",    power: perms.getState("m.room.topic") },
      { category: "Permission permissions" },
      { name: "Default Power",   id: "default",  power: perms.users_default ?? 0 },
      { name: "Manage Power",    id: "power",    power: perms.getState("m.room.power_levels") },
      // { name: "Manage Settings", id: "perms",    power: perms.state_default ?? 50 },
      { category: "????" },
      { name: "Change Avatar",   id: "avatar",   power: perms.getState("m.room.avatar") },
      { name: "Upgrade Room",    id: "upgrade",  power: perms.getState("m.room.tombstone") },
      { name: "History",         id: "history",  power: perms.getState("m.room.history_visibility") },
      { name: "Encrypt",         id: "encrypt",  power: perms.getState("m.room.encryption") },
    ];
  }
}

function handleChange(item, power) {  
  if (item.power === power) {
    modified.delete(item.id);
  } else {
    modified.set(item.id, power);
  }
  isModified = modified.size;
}

$: if (isModified) {
  save = async () => {
    const levels = $room.getState("m.room.power_levels")?.content;
    for (let [id, power] of modified) {
      const has = (key) => levels[key] ?? (levels[key] = {});
      switch(id) {
        case "message":  levels.events_default = power; break;
        case "reaction": has("events"); levels.events["m.room.reaction"] = power; break;
        case "invite":   levels.invite = power; break;
        case "kick":     levels.kick = power; break;
        case "ban":      levels.ban = power; break;
        case "redact":   levels.redact = power; break;
        case "name":     has("events"); levels.events["m.room.name"] = power; break;
        case "topic":    has("events"); levels.events["m.room.topic"] = power; break;
        case "avatar":   has("events"); levels.events["m.room.avatar"] = power; break;
        case "power":    has("events"); levels.events["m.room.power_levels"] = power; break;
        // case "perms":    levels["key"] = power; break;
        case "default":  levels.users_default = power; break;
        case "ping":     has("notifications"); levels.notifications.room = power; break;
        case "rooms":    has("events"); levels.events["m.space.child"] = power; break;
        case "history":  has("events"); levels.events["m.room.history_visibility"] = power; break;
        case "encrypt":  has("events"); levels.events["m.room.encryption"] = power; break;
      }
    }
    await state.api.sendState($room.id, "m.room.power_levels", "", levels);
    modified.clear();
    isModified = false;
  };
} else {
  save = null;
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
  font-family: inherit;
  font-weight: 500;
  font-size: 16px;
  text-transform: initial;
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
    <div style="flex: 1">
    </div>
    <Power
      value={item.power}
      max={perms.me}
      disabled={perms.me < perms.getState("m.room.power_levels") || perms.me < item.power}
      changed={power => handleChange(item, power)}
    />
  </div>
{/if}
{/each}
{:else}
<p>permissions failed to load!</p>
{/if}
<div style="padding: 1em"></div>
{#if isModified}
<Confirm />
{/if}
