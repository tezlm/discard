<script>
import Radio from "../../atoms/Radio.svelte";
import Button from "../../atoms/Button.svelte";
import Toggle from "../../atoms/Toggle.svelte";
export let room;
// TODO: disabled tooltip
// TODO: make this work, live update
const getIds = type => state.spaces.get(type).map(i => i.roomId);
const isOrphan = [...getIds("orphanRooms"), ...getIds("orphanSpaces")].includes($room.roomId);

$: history_visibility = $room.getState("m.room.history_visibility")?.content.history_visibility ?? "shared";
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
<Radio selected={"invite"} options={[
  { id: "invite",     name: "Invite-only", detail: "Members must be invited to this room.", disabled: true },
  { id: "restricted", name: "Restricted",  detail: "Any member part of this space can join.", disabled: isOrphan, disabled: true },
  { id: "public",     name: "Public",      detail: "Anyone can join this room.", disabled: true },
  { id: "published",  name: "Published",   detail: "Public, and published to the room directory.", disabled: true },
]} />
<div style="margin-top: 8px">
  <div style="display: flex; justify-content: space-between">
    Allow knocking
    <Toggle />
  </div>
  <div style="color: var(--fg-muted)">
    Knocking allows users to request to join this room.
  </div>
</div>
<div style="margin: 1em"></div>
<div class="title">Message History</div>
<Radio selected={history_visibility} options={[
  { id: "world_readable", name: "Everyone", detail: "Includes guests. Good for public rooms.", color: "var(--color-accent)" },
  { id: "shared",         name: "Members",  detail: "All members since selecting this option.", color: "var(--color-green)" },
  { id: "invited",        name: "Members, after invite", detail: "All members since they were invited.", color: "var(--color-yellow)" },
  { id: "joined",         name: "Members, after join",   detail: "All members since they joined.", color: "var(--color-red)" },
]} />