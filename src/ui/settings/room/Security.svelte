<script>
import Radio from "../../atoms/Radio.svelte";
import Button from "../../atoms/Button.svelte";
import Toggle from "../../atoms/Toggle.svelte";
export let room;
export let save;
// TODO: disabled tooltip
// TODO: make this work, live update
const getIds = type => state.spaces.get(type).map(i => i.roomId);
const isOrphan = [...getIds("orphanRooms"), ...getIds("orphanSpaces")].includes($room.roomId);
let allowKnock;
$: roomVersion = $room.getState("m.room.create")?.content?.room_version;

const versions = {
  knock: ["7", "8", "9", "10"],
  restricted: ["8", "9", "10"],
  knockRestricted: ["10"],
};

$: historyVisibility = $room.getState("m.room.history_visibility")?.content.history_visibility ?? "shared";
$: newHistoryVisibility = historyVisibility;
$: joinRule = $room.joinRule;

$: if (newHistoryVisibility !== historyVisibility) {
  save = () => {}
} else {
  save = null
}
</script>
<div class="title">Encryption</div>
<p>
  Enabling end to end encryption prevents servers from reading messages. Enabling e2ee is irreversable. Enabling e2ee is not suggested for public rooms.
</p>
<div style="margin: 12px"></div>
<div>
  <Button type="hollow" label="Enable e2ee" clicked={todo} />
</div>
<div style="margin: 1em"></div>
<div class="title">Access</div>
<!-- TODO: redo this
- allow editing which spaces allow restricted
- you can enable knocking for public and published rooms? (entire knocking system seems strange)
- separate option for knocking?
  - public + knock is unintuitive since it still would allow everyone to join
- should i keep published as a separate option or allow publishing invite-only/restricted rooms to room directory
-->
<Radio selected={joinRule} options={[
  { id: "invite",     name: "Invite-only", detail: `Members must be invited to this room.`, disabled: allowKnock && "This rule doesn't make sense with knocking" },
  { id: "restricted", name: "Restricted",  detail: `Any member part of this space can join${allowKnock ? ", and anyone can knock" : ""}.`, disabled:  !(allowKnock ? versions.knockRestricted : versions.restricted).includes(roomVersion) ? "Room version does not support this join rule" : (isOrphan && "This room is not in a space!") },
  { id: "public",     name: "Public",      detail: `Anyone can ${allowKnock ? "knock on" : "join"} this room.`, disabled: allowKnock && !versions.knock.includes(roomVersion) && "Room version does not support this join rule" },
  { id: "published",  name: "Published",   detail: `Public, and published to the room directory.` },
]} />
<div style="margin-top: 8px">
  <div style="display: flex; justify-content: space-between">
    Allow knocking
    <Toggle bind:checked={allowKnock} />
  </div>
  <div style="color: var(--fg-muted)">
    Knocking allows users to request to join this room.
  </div>
</div>
<div style="margin: 1em"></div>
<div class="title">Message History</div>
<Radio bind:selected={newHistoryVisibility} options={[
  { id: "world_readable", name: "Everyone", detail: "Includes guests. Good for public rooms.", color: "var(--color-accent)" },
  { id: "shared",         name: "Members",  detail: "All members since selecting this option.", color: "var(--color-green)" },
  { id: "invited",        name: "Members, after invite", detail: "All members since they were invited.", color: "var(--color-yellow)" },
  { id: "joined",         name: "Members, after join",   detail: "All members since they joined.", color: "var(--color-red)" },
]} />