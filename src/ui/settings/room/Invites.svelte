<script>
import { getAvatar } from "../../../util/events.js";
export let room;
let members = room.getMembersWithMembership("invite");

function showPopup(member) {
  const event = member.events.member;
  const reason = event.getContent().reason ?? null;
  state.popup.set({
    id: "member-invite",
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

.invite {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: solid var(--color-gray) 1px;
  cursor: pointer;
}

.invite .avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--bg-spaces);
  color: transparent;
}

.invite .name {
  color: var(--fg-notice);
  margin-left: 8px;
}
</style>
{#if room}
<h1>{members.length || "No"} Invite{members.length !== 1 ? "s" : ""}</h1>
{#each members as member}
<div class="invite" on:click={() => showPopup(member)}>
  <img class="avatar" src={getAvatar(member.userId)} alt="avatar for {member.name}"/>
  <div class="name">{member.name}</div>
</div>
{:else}
<p>what do i put here</p>
{/each}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
