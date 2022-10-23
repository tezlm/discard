<script>
import { calculateHash } from "../../util/content";
import { memberContext } from "../../util/context";

export let member;
export let bold = false;
let { settings } = state;

function getColor(member, settings) {
  const level = settings.get("namecolors");
  if (!member) return;
  if (level === "never") return `var(--fg-content)`;
  if (level === "power" && member.power <= member.room.power.usersDefault) return `var(--fg-content)`;
  return `var(--mxid-${calculateHash(member.id) % 8 + 1})`
}
</script>
<style>
.member {
  font-weight: 700;
  cursor: pointer;
}

.member:hover {
  text-decoration: underline;
}
</style>
<span
  class="member"
  style:color={getColor(member, $settings)}
  style:font-weight={bold ? "700" : "500"}
  data-mx-ping={member.id}
  on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: memberContext(member), x: e.clientX, y: e.clientY })}
>
  {member.name || member.id}
</span>

