<script>
import Radio from "../../atoms/Radio.svelte";
import Button from "../../atoms/Button.svelte";
export let room;
// TODO: disabled tooltip
// TODO: make this work, live update
const getIds = type => state.spaces.get(type).map(i => i.roomId);
const isOrphan = [...getIds("orphanRooms"), ...getIds("orphanSpaces")].includes($room.roomId);
</script>
<div class="title">Encryption</div>
<p>
  Enabling end to end encryption prevents servers from reading messages. Enabling e2ee is irreversable. Enabling e2ee is not suggested for public rooms.
</p>
<div style="height: 12px"></div>
<div>
  <Button type="hollow" label="Enable e2ee" clicked={todo} />
</div>
<div style="height: 1em"></div>
<div class="title">Access</div>
<Radio selected={"invite"} options={[
  { id: "invite",     name: "Invite-only", detail: "Members must be invited to this room." },
  { id: "restricted", name: "Restricted",  detail: "Any member part of this space can join.", disabled: isOrphan },
  { id: "public",     name: "Public",      detail: "Anyone can join this room." },
  { id: "published",  name: "Published",   detail: "Public, and published to the room directory." },
]} />
<div style="height: 1em"></div>
<div class="title">Message History</div>
<Radio selected={"member"} options={[
  { id: "world",  name: "Everyone", detail: "Includes guests. Good for public rooms.", color: "var(--color-accent)" },
  { id: "member", name: "Members",  detail: "All members since selecting this option.", color: "var(--color-green)" },
  { id: "invite", name: "Members, after invite", detail: "All members since they were invited.", color: "var(--color-yellow)" },
  { id: "join",   name: "Members, after join",   detail: "All members since they joined.", color: "var(--color-red)" },
]} />