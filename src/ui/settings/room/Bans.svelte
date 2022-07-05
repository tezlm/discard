<script>
import { getAvatar } from "../../../util/events.js";
export let room;

console.log(room)

function showPopup(member) {
  const event = member.events.member;
  const reason = event.getContent().reason ?? null;
  state.popup.set({
    id: "ban",
    name: member.name,
    date: event.getDate(),
    reason: reason === "<no reason supplied>" ? null : reason,
    powerLevel: member.powerLevel,
  });
}
</script>
<style>
.ban {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: solid var(--color-gray) 1px;
  cursor: pointer;
}

.ban .avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--bg-spaces);
  color: transparent;
}

.ban .name {
  color: var(--fg-notice);
  margin-left: 8px;
}
</style>
{#if room}
{#each room.getMembersWithMembership("ban") as member}
<div class="ban" on:click={() => showPopup(member)}>
  <img class="avatar" src={getAvatar(member.userId)} alt="avatar for {member.name}"/>
  <div class="name">{member.name}</div>
</div>
{:else}
<p>no bans</p>
{/each}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
