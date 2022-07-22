<script>
import Input from "../../atoms/Input.svelte";
import { parseMxc, defaultAvatar } from '../../../util/content.js';

export let room, membership;
let missingAvs = state.missingAvatars;

let allMembers = false;
let members = false;
let filter;

$: setTimeout(async () => {
  await $room.members.fetch();
  allMembers = $room.members.with(membership);
});

$: if (allMembers) {
  members = allMembers.filter(i => i.name.includes(filter) || i.userId.includes(filter));
}

function showPopup(member) {
  const power = $room.power;
  state.popup.set({
    id: "member",
    membership,
    member,
    room: $room,
    canBan: power.me > power.getUser(member.userId) && power.me >= power.getBase("ban"),
    canKick: power.me > power.getUser(member.userId) && power.me >= power.getBase("kick"),
    canInvite: power.me > power.getUser(member.userId) && power.me >= power.getBase("invite"),
  });
}

function getTitle(membership) {
  switch (membership) {
    case "join": return "Member";
    case "invite": return "Invite";
    case "ban": return "Ban";
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

.input {
  
}

.member {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: solid var(--color-gray) 1px;
  cursor: pointer;
}

.member .avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--bg-spaces);
  color: transparent;
}

.member .name {
  display: flex;
  flex-direction: column;
  color: var(--fg-notice);
  margin-left: 16px;
}
</style>
{#if room}
  <div class="header">
    <h1>{members ? members.length || "No" : "Loading"} {filter ? "Filtered " : ""}{getTitle(membership)}{members.length !== 1 ? "s" : ""}</h1>
    <div><Input small placeholder="Filter {getTitle(membership).toLowerCase()}s" bind:value={filter} /></div>
  </div>
  {#if members}
    {#each members as member}
    <div class="member" on:click={() => showPopup(member)}>
      <img
        class="avatar"
        alt="avatar for {member.name}"
        src={missingAvs.has(member.userId) ? defaultAvatar : parseMxc(member.avatar, 40)}
        on:error={(e) => { missingAvs.add(member.userId); e.target.src = defaultAvatar }}
        loading="lazy"
      />
      <div class="name">
        {member.name}
        <span style="color: var(--fg-muted); font-size: 14px">{member.userId}</span>
      </div>
      {#if membership === "join"}
      <div style="margin-left: auto;">{member.power}</div>
      {/if}
    </div>
    {:else}
    <p>hmmm, seems like nobody's here?</p>
    {/each}
  {/if}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
