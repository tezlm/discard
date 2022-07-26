<script>
import Popup from "../atoms/Popup.svelte";
import Button from "../atoms/Button.svelte";
import { formatDate } from "../../util/format.js";
export let current;
$: member = current.member;
$: membership = current.membership;

const banWords = ["banned", "yeeted", "purged", "banished", "eliminated", "neutralized", "exiled", "expelled", "discontinued", "abolished", "discharged", "vanquished", "ejected"];
const banModifiers = ["violently", "thoroughly", "briskly"];

function closePopup() {
  state.popup.set({ ...current, id: null });
}

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getState() {
  if (membership === "ban") {
    const prefix = member.power < 0 ? rnd(banModifiers)
      : member.power > 0 ? "fired"
      : "";
    return `${prefix} ${rnd(banWords)}`;
  } else if (membership === "invited") {
    return "invited";
  } else if (membership === "joined") {
    return "joined";
  } else {
    return "did something";
  }
}
</script>
<Popup>
  <h2 slot="header">{member.name}</h2>
  <div slot="content" style="margin-top: -8px">
    {#if ["invite", "ban"].includes(membership)}
      <div style:color="var(--fg-muted)">{getState()} {formatDate(member.date, true)}</div>
      <hr />
      <div>
        {#if current.reason && current.reason !== "<no reason supplied>"}
          {current.reason}
        {:else}
          <i>no reason supplied</i>
        {/if}
      </div>
    {/if}
  </div>
  <div slot="footer">
    <Button type="link" label="Okay" clicked={closePopup} />
    {#if current.canKick && membership !== "ban"}
      <Button type="danger" label={membership === "join" ? "Kick" : "Disinvite"} clicked={todo} />
    {/if}
    {#if current.canBan}
      {#if membership === "ban"}
      <Button type="danger" label="Unban" clicked={todo} />
      {:else}
      <Button type="danger" label="Ban" clicked={() => state.popup.set({ id: "ban", member, room: current.room })} />
      {/if}
    {/if}
  </div>
</Popup>
