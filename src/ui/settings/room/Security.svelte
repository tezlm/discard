<script>
import Radio from "../../atoms/Radio.svelte";
import Button from "../../atoms/Button.svelte";
import Toggle from "../../atoms/Toggle.svelte";
export let room;
export let save;

const getIds = type => state.spaces.get(type).map(i => i.id);
const isOrphan = [...getIds("orphanRooms"), ...getIds("orphanSpaces")].includes(room.id);
$: roomVersion = room.getState("m.room.create")?.content?.room_version;

const versions = {
  knock: ["7", "8", "9", "10"],
  restricted: ["8", "9", "10"],
  knockRestricted: ["10"],
};

// TODO: restricted room selector

function getHistoryVisibility() {
  return room.getState("m.room.history_visibility")?.content.history_visibility ?? "shared";
}

function getJoinRule() {
  return room.getState("m.room.join_rules")?.content ?? { join_rule: "invite" };
}

function isEqual(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (let key in obj1) {
    if (typeof obj1[key] === "object" && typeof obj2[key] === "object" && obj1[key] && obj2[key]) {
      if (!isEqual(obj1[key], obj2[key])) return false;
    } else if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

let historyVisibility = getHistoryVisibility();
let joinRule = structuredClone(getJoinRule());

$: radioJoinRule = joinRule === "knock" ? "public" : joinRule === "knock_restricted" ? "restricted" : joinRule.join_rule;
$: allowKnock = ["knock", "knock_restricted"].includes(joinRule.join_rule);

state.api.roomDirVisibility(room.id);

$: {
  let histVisChanged = historyVisibility !== getHistoryVisibility();
  let joinRuleChanged = !isEqual(joinRule, getJoinRule());
  if (histVisChanged || joinRuleChanged) {
    save = async () => {
      const proms = [];
      if (histVisChanged) proms.push(room.sendState("m.room.history_visibility", { history_visibility: historyVisibility }));
      if (joinRuleChanged) proms.push(room.sendState("m.room.join_rules", joinRule));
      await Promise.all(proms);
      save = null;
    };
  } else {
    save = null;
  }
}

function updateJoinRule() {
  if (allowKnock) {
    joinRule.join_rule = radioJoinRule === "restricted" ? "knock_restricted" : "knock";
  } else {
    joinRule.join_rule = radioJoinRule === "published" ? "public" : radioJoinRule;
  }
  console.log(joinRule, radioJoinRule === "published")
}

export function reset() {
  historyVisibility = getHistoryVisibility();
  joinRule = structuredClone(getJoinRule());
}
</script>
<div class="title">Encryption</div>
<div class="warning">end to end encryption is not implemented</div>
<p>
  Enabling end to end encryption prevents servers from reading messages. Enabling e2ee is irreversable. Enabling e2ee is not suggested for public rooms.
</p>
<div style="margin: 12px"></div>
<div>
  <Button type="hollow" label="Enable e2ee" clicked={todo} />
</div>
<div style="margin: 1em"></div>
<div class="title">Access</div>
<div class="warning">join rules selector is a work in progress and may not work properly</div>
<!-- TODO: allow editing which spaces allow restricted -->
<Radio bind:selected={radioJoinRule} changed={updateJoinRule} options={[
  { id: "invite",     name: "Invite-only", detail: `Members must be invited to this room.`, disabled: allowKnock && "This rule doesn't make sense with knocking" },
  { id: "restricted", name: "Restricted",  detail: `Any member part of this space can join${allowKnock ? ", and anyone can knock" : ""}.`, disabled:  !(allowKnock ? versions.knockRestricted : versions.restricted).includes(roomVersion) ? "Room version does not support this join rule" : (isOrphan && "This room is not in a space!") },
  { id: "public",     name: "Public",      detail: `Anyone can ${allowKnock ? "knock on" : "join"} this room.`, disabled: allowKnock && !versions.knock.includes(roomVersion) && "Room version does not support this join rule" },
  { id: "published",  name: "Published",   detail: `Public, and published to the room directory.` },
]} />
<div style="margin-top: 8px">
  <div style="display: flex; justify-content: space-between">
    Allow knocking
    <Toggle bind:checked={allowKnock} toggled={updateJoinRule} />
  </div>
  <div style="color: var(--fg-muted)">
    Knocking allows users to request to join this room.
  </div>
</div>
<div style="margin: 1em"></div>
<div class="title">History Visibility</div>
<p>Who can read message history?</p>
<Radio bind:selected={historyVisibility} options={[
  { id: "world_readable", name: "Everyone", detail: "Includes guests. Good for public rooms.", color: "var(--color-accent)" },
  { id: "shared",         name: "Members",  detail: "All members since selecting this option.", color: "var(--color-green)" },
  { id: "invited",        name: "Members, after invite", detail: "All members since they were invited.", color: "var(--color-yellow)" },
  { id: "joined",         name: "Members, after join",   detail: "All members since they joined.", color: "var(--color-red)" },
]} />
<div style="min-height: 100px"></div>
