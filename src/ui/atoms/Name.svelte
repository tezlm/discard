<script>
import { calculateHash } from "../../util/content";
import { memberContext } from "../../util/context";
import { fastclick } from "../../util/use";

export let member;
export let bold = false;
export let light = false;
let { settings, popout, context } = state;

function getColor(member, settings) {
  const level = settings.get("namecolors");
  if (!member) return;
  if (level === "never") return `var(--fg-content)`;
  if (level === "power" && member.power <= member.room.power.usersDefault) return `var(--fg-content)`;
  return `var(--mxid-${calculateHash(member.id) % 8 + 1})`;
}

function showPopout(e) {
  const rect = e.target.getBoundingClientRect();
  if ($popout._owner === e.target) return $popout = {};
  $popout = {
    id: "member",
    member: member,
    animate: "right",
    top: rect.y,
    left: rect.x + rect.width + 8,
    _owner: e.target,
  };
}
</script>
<style>
.member {
  cursor: pointer;
}

.member:hover {
  text-decoration: underline;
}
</style>
<span
  class="member"
  style:color={getColor(member, $settings)}
  style:font-weight={bold ? "700" : light ? null : "500"}
  use:fastclick
  on:fastclick={showPopout}
  on:click|stopPropagation
  on:contextmenu|preventDefault|stopPropagation={e => $context = { items: memberContext(member), x: e.clientX, y: e.clientY }}
>
  {member.name || member.id}
</span>

