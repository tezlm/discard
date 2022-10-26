<script>
import Search from "../../atoms/Search.svelte";
import Avatar from "../../atoms/Avatar.svelte";
import Power from "../../atoms/Power.svelte";
import { memberContext } from "../../../util/context";

export let room, membership;

let { users } = state;
let { power } = room;
let resets = {};

let allMembers = false;
let members = false;
let filter;

$: setTimeout(async () => {
  await room.members.fetch();
  allMembers = room.members.with(membership);
});

$: if (allMembers) {
  members = allMembers.filter(i => i.name?.includes(filter) || i.id.includes(filter));
}

function getTitle(membership) {
  switch (membership) {
    case "join": return "Member";
    case "invite": return "Invite";
    case "ban": return "Ban";
  }
}

async function getMember(member) {
  if (membership === "join") return member;
  if (users.has(member.id)) return users.get(member.id);
  const { displayname, avatar_url } = await state.api.fetchUser(member.id);
  const data = { avatar: avatar_url, name: displayname || member.id, id: member.id };
  // mutation isnt that good of an idea, but oh well
  member.name = data.name;
  member.avatar = data.avatar;
  users.set(member.id, data);
  return data;
}

function changePower(member, pl) {
  if (pl === member.power) return;
  if (pl === power.me) {
    state.popup.set({
      id: "dialog",
      title: "Change power level?",
      html: "You are about to change this member's power level to the same level as yourself! You will <b>not</b> be able to demote them after this change. Are you absolutely sure you want to do this?",
      button: "Promote!",
      danger: true,
      clicked: () => member.setPower(pl),
      cancel: () => resets[member.id]?.(),
    });
  } else if (member.id === state.userId) {
    state.popup.set({
      id: "dialog",
      title: "Change power level?",
      html: "You are about to demote yourself! You will <b>not</b> be able to undo this. Are you absolutely sure you want to demote yourself?",
      button: "Demote!",
      danger: true,
      clicked: () => member.setPower(pl),
      cancel: () => resets[member.id]?.(),
    });
  } else {
    member.setPower(pl);
  }
}
</script>
<style>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}

h1 {
  font: 20px var(--font-display);
  font-weight: 500;
}

.member {
  display: flex;
  padding: 8px 0;
  border-top: solid var(--color-gray) 1px;
}

.member .name {
  display: flex;
  flex-direction: column;
  color: var(--fg-notice);
  margin-left: 16px;
}

.menu {
  display: flex;
  align-items: center;
}

.menu {
  font-size: 26px;
  margin-left: 16px;
  padding: 8px;
  color: var(--fg-dim);
  opacity: 0;
  cursor: pointer;
  transition: color .2s;
}

.member:hover .menu {
  opacity: 1;
}

.menu:hover {
  color: var(--fg-notice);
}
</style>
{#if room}
  <div class="header">
    <h1>{members ? members.length || "No" : "Loading"} {filter ? "Filtered " : ""}{getTitle(membership)}{members.length !== 1 ? "s" : ""}</h1>
    <div><Search width={220} placeholder="Filter {getTitle(membership).toLowerCase()}s" bind:value={filter} /></div>
  </div>
  {#if members}
    {#each members as member (member.id)}
    <div class="member" on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: memberContext(member), x: e.clientX, y: e.clientY })}>
      {#await getMember(member)}
        <Avatar user={member} size={40} />
        <div class="name">
          {member.id}
          <span style="color: var(--fg-muted); font-size: 14px">{member.id}</span>
        </div>
      {:then data}
        <Avatar user={data} size={40} />
        <div class="name">
          <div>
            {data.name || data.id}
            <span style="color: var(--fg-muted); font-size: 14px">
            {#if member.event?.content.reason}
              ({member.event.content.reason})
            {/if}
            </span>
          </div>
          <span style="color: var(--fg-muted); font-size: 14px">{data.id}</span>
        </div>
      {:catch}
        <Avatar user={member} size={40} />
        <div class="name">
          {member.name || member.id}
          <span style="color: var(--fg-muted); font-size: 14px">{member.id}</span>
        </div>
      {/await}
      <div style="margin-left: auto;"></div>
      {#if membership === "join"}
      <!-- FIXME: this is very broken in general and doesn't update power levels -->
      <Power
        value={member.power}
        disabled={(power.me < power.forState("m.room.power_levels") || (power.me <= member.power && member.id !== state.userId))}
        max={power.me}
        changed={(level) => changePower(member, level)}
        bind:reset={resets[member.id]}
      />
      {/if}
      <div class="icon menu" on:click|stopPropagation={e => state.context.set({ items: memberContext(member), x: e.clientX, y: e.clientY })}>more_vert</div>
    </div>
    {:else}
    <p>hmmm, seems like nobody's here?</p>
    {/each}
  {/if}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
