<script>
import { getAvatar } from "../../../util/events.js";
export let room;
let members = room.getMembersWithMembership("join");

function showPopup(member) {
  const event = member.events.member;
  const reason = event.getContent().reason ?? null;
  state.popup.set({
    id: "member-joined",
    name: member.name,
    date: event.getDate(),
    reason: reason === "<no reason supplied>" ? null : reason,
    powerLevel: member.powerLevel,
  });
}
</script>
<style>
h1 {
  margin-bottom: 1em;
  font: 20px var(--font-display);
  font-weight: 500;
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
<h1>{members.length || "No"} Member{members.length !== 1 ? "s" : ""}</h1>
{#each members.sort((a, b) => a.powerLevel > b.powerLevel ? -1 : 1) as member}
<div class="member" on:click={() => showPopup(member)}>
  <img class="avatar" src={getAvatar(member.userId)} alt="avatar for {member.name}"/>
  <div class="name">
    {member.name}
    <span style="color: var(--fg-muted); font-size: 14px">{member.userId}</span>
  </div>
  <div style="margin-left: auto;">{member.powerLevel}</div>
</div>
{:else}
<p>what do i put here</p>
{/each}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
