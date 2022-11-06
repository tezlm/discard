<script>
import Search from "../../atoms/Search.svelte";
import Avatar from "../../atoms/Avatar.svelte";
import Power from "../../atoms/Power.svelte";
import Loading from "../../atoms/Loading.svelte";
import { memberContext } from "../../../util/context";

export let room, membership;

let { users, popup, context } = state;
let { power } = room;

let allMembers = false;
let members = false;
let filter;

$: setTimeout(async () => {
  await room.members.fetch();
  allMembers = room.members.with(membership);
});

$: if (allMembers) {
  members = filter ? allMembers.filter(i => i.name?.includes(filter) || i.id.includes(filter)) : allMembers;
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
  const { displayname, avatar_url } = await state.api.fetchUser(member.id)
    .catch(() => ({ displayname: member.name, avatar_url: member.avatar }));
  const data = { avatar: avatar_url, name: displayname || member.id, id: member.id };
  // mutation isnt that good of an idea, but oh well
  member.name = data.name;
  member.avatar = data.avatar;
  users.set(member.id, data);
  return data;
}

 /*_/| 
 =0-0=
 \'I'|
 |<|,,\_
 |[>,,/,\ 
 |[|,\_,,)
 ((J(=_*/

function changePower(member, pl, undo) {
  if (pl === member.power) return;
  if (pl === power.me) {
    $popup = {
      id: "dialog",
      title: "Change power level?",
      html: "You are about to change this member's power level to the same level as yourself! You will <b>not</b> be able to demote them after this change. Are you absolutely sure you want to do this?",
      button: "Promote!",
      danger: true,
      clicked: () => member.setPower(pl),
      cancel: () => undo(),
    };
  } else if (member.id === state.userId) {
    $popup = {
      id: "dialog",
      title: "Change power level?",
      html: "You are about to demote yourself! You will <b>not</b> be able to undo this. Are you absolutely sure you want to demote yourself?",
      button: "Demote!",
      danger: true,
      clicked: () => member.setPower(pl),
      cancel: () => undo(),
    };
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
    <h1>{members ? members.length || "No" : "Loading"} {filter ? "Filtered " : ""} {getTitle(membership)}s</h1>
    <div style:width="220px"><Search placeholder="Filter {getTitle(membership).toLowerCase()}s" bind:value={filter} /></div>
  </div>
  {#if members}
    {#await Promise.all(members.map(i => getMember(i)))}
      <i style="margin-bottom: 16px">this may take a while</i>
      <Loading color="var(--fg-muted)" />
    {:then memberData}
      {#each memberData as data, i (members[i].id)}
        {@const member = members[i]}
        <div class="member" on:contextmenu|preventDefault|stopPropagation={e => $context = { items: memberContext(member), x: e.clientX, y: e.clientY }}>
          <Avatar link user={data} size={40} />
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
          <div style="margin-left: auto;"></div>
          {#if membership === "join"}
          <!-- FIXME: this is very broken in general and doesn't update power levels -->
          <Power
            value={member.power}
            disabled={(power.me < power.forState("m.room.power_levels") || (power.me <= member.power && member.id !== state.userId))}
            max={power.me}
            changed={(level, undo) => changePower(member, level, undo)}
          />
          {/if}
          <div class="icon menu" on:click|stopPropagation={e => $context = { items: memberContext(member), x: e.clientX, y: e.clientY }}>more_vert</div>
        </div>
      {:else}
        <i>hmmm, seems like nobody's here?</i>
      {/each}
    {/await}
  {:else}
    <Loading color="var(--fg-muted)" />
  {/if}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
