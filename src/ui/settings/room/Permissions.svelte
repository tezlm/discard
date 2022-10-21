<script>
import Power from "../../atoms/Power.svelte";
import { onDestroy } from "svelte";
export let room;
export let save;
$: perms = room.power;

let modified = new Map();

// TODO: preserve permissions when someone else updates them
const updateRoom = () => { modified.clear(); modified = modified; room = room };
state.client.on("state", updateRoom);
onDestroy(() => state.client.off("state", updateRoom));

const info = {
  message:  { name: "Send Messages",   description: "The minimum power required to send messages." },
  reaction: { name: "Send Reactions",  description: "The minimum power required to add reactions to messages. Unlike discord, disabling this permission will also disallow reacting with existing reactions." },
  invite:   { name: "Invite Users",    description: `The minimum power required to invite new people to this ${room.type}.` },
  kick:     { name: "Kick Members",    description: `The minimum power required to remove other (lower-powered) members from this ${room.type}. Kicked members can rejoin with an invite ${room.joinRule === "public" ? "or a link." : ""}` },
  ban:      { name: "Ban Members",     description: `The minimum power required to remove other (lower-powered) members from this ${room.type}. Bans last forever, or until an unban.` },
  redact:   { name: "Redact Messages", description: "The minimum power required to remove messages." },
  name:     { name: "Change Name",     description: `The minimum power required to change this ${room.type}'s name.` },
  topic:    { name: "Change Topic",    description: `The minimum power required to change this ${room.type}'s topic.` },
  avatar:   { name: "Change avatar",   description: `The minimum power required to change this ${room.type}'s avatar.` },
  power:    { name: "Manage Power",    description: "The minimum power required to change these permissions and other people's power levels." },
  // perms{ name: "", description: :    "The minimum power required to change these minimum power levels." },
  default:  { name: "Default Power",   description: "Everyone's default power level." },
  ping:     { name: "Ping room",       description: "The minimum power required to ping everyone. The @everyone of matrix." },
  rooms:    { name: "Manage Rooms",    description: "The minimum power required to add/remove rooms to this space." },
  upgrade:  { name: "Upgrade",         description: "The minimum power required to upgrade this room to a nev version" },
  history:  { name: "History",         description: "The minimum power required to change history visibility" },
  encrypt:  { name: "Encript",         description: "The minimum power required to enable end to end encryption" },
};

function getItems(room) {
  const power = room.power;
  const items = [];
  if (room.type === "m.space") {
    items.push(
        { category: "Room list permissions" },
        { id: "rooms", power: power.forState("m.space.child") },
    );
  } else {
    items.push(
      { category: "Basic permissions" },
      { id: "message",  power: power.eventsDefault ?? 0 },
      { id: "reaction", power: power.forEvent("m.room.reaction") },
      { id: "redact",   power: power.redact ?? 0 },
      { id: "ping",     power: power.notifications?.room ?? power.stateDefault },
    );
  }
  items.push(
      { category: "Membership permissions" },
      { id: "invite", power: power.invite },
      { id: "kick",   power: power.kick },
      { id: "ban",    power: power.ban },    
      { category: `${room.type === "m.space" ? "Space" : "Room"} profile permissions` },
      { id: "name",   power: power.forState("m.room.name") },
      { id: "topic",  power: power.forState("m.room.topic") },
  );
  if (room.type === "m.space") {
    items.push({ id: "avatar",   power: power.forState("m.room.avatar") });
  }
  items.push(
      { category: "Permission permissions" },
      { id: "default",  power: power.usersDefault },
      { id: "power",    power: power.forState("m.room.power_levels") },
      // { name: "Manage Settings", id: "perms",    power: perms.stateDefault },
      { category: "????" },
      { id: "upgrade",  power: power.forState("m.room.tombstone") },
      { id: "history",  power: power.forState("m.room.history_visibility") },
      { id: "encrypt",  power: power.forState("m.room.encryption") },
  );
  return items;
}

function handleChange(item, power) {  
  if (item.power === power) {
    modified.delete(item.id);
  } else {
    modified.set(item.id, power);
  }
  modified = modified;
}

export function reset() {
  modified.clear();
  modified = modified;
  room = room;  
}

$: if (modified.size) {
  save = async () => {
    const levels = room.getState("m.room.power_levels")?.content;
    for (let [id, power] of modified) {
      const has = (key) => levels[key] ?? (levels[key] = {});
      switch(id) {
        case "message":  {
          // make sure disabling messages doesn't disable anything else
          if (!levels.events?.["m.room.reaction"]) {
            has("events");
            levels.events["m.room.reaction"] = levels.events_default;
          }
          levels.events_default = power;
          break;
        }
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
    await room.sendState("m.room.power_levels", levels);
    modified.clear();
    // modified = modified;
  };
} else {
  save = null;
}
</script>
<style>
.item {
  display: flex;
  padding: 16px 0;
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
{#each getItems(room) as item}
{#if item.category}
  <h3 class="category">{item.category}</h3>
{:else}
  <div class="item">
    <div>
      <h5 class="title">{info[item.id].name}</h5>
      <div class="description">{info[item.id].description}</div>
    </div>
    <div style="flex: 1; display: flex; margin-left: 8px">
      <div style="flex: 1;"></div>
      <Power
        value={item.power}
        max={perms.me}
        disabled={perms.me < perms.forState("m.room.power_levels") || perms.me < item.power}
        changed={power => handleChange(item, power)}
      />
    </div>
  </div>
{/if}
{/each}
{:else}
<p>permissions failed to load!</p>
{/if}
<div style="padding: 1em"></div>
