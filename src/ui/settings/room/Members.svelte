<script>
import Input from "../../atoms/Input.svelte";
import { parseMxc, defaultAvatar } from '../../../util/content.js';

export let room, membership;
let missingAvs = state.missingAvatars;
let users = state.users;

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

async function getMember(member) {
  if (membership === "join") return member;
  if (users.has(member.userId)) return users.get(member.userId);
  const { displayname, avatar_url } = await state.api.fetchUser(member.userId);
  const data = { avatar: avatar_url, name: displayname || member.userId, userId: member.userId };
  users.set(member.userId, data);
  return data;
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

.power, .menu {
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
    <div><Input small placeholder="Filter {getTitle(membership).toLowerCase()}s" bind:value={filter} /></div>
  </div>
  {#if members}
    {#each members as member}
    <div class="member" on:click={() => showPopup(member)}>
      {#await getMember(member)}
        <div class="avatar"></div>
        <div class="name">
          {member.userId}
          <span style="color: var(--fg-muted); font-size: 14px">{member.userId}</span>
        </div>
      {:then member}
      <a href={missingAvs.has(member.userId) ? defaultAvatar : parseMxc(member.avatar, 40)}>
        <img
          class="avatar"
          alt="avatar for {member.name}"
          src={missingAvs.has(member.userId) ? defaultAvatar : parseMxc(member.avatar, 40)}
          on:error={(e) => { missingAvs.add(member.userId); e.target.src = defaultAvatar }}
          loading="lazy"
        />
      </a>
      <div class="name">
        {member.name}
        <span style="color: var(--fg-muted); font-size: 14px">{member.userId}</span>
      </div>
      {/await}
      <div style="margin-left: auto;"></div>
      {#if membership === "join"}
      <div class="power">{member.power}</div>
      {/if}
      <div class="icon menu">more_vert</div>
    </div>
    {:else}
    <p>hmmm, seems like nobody's here?</p>
    {/each}
  {/if}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
