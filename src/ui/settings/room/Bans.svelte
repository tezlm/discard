<script>
let mxcToHttp = h => h?.replace(/mxc:\/\/([^/]+)\/(.+)/, `https://celery.eu.org/_matrix/media/r0/download/$1/$2`) // TODO: not hardcode this, split into module
export let room;
let members = false;
setTimeout(async () => {
  if (!$room.members.ready) await $room.members.fetch();
  members = $room.members.get("ban")
});

function showPopup(member) {
  state.popup.set({
    id: "member-banned",
    name: member.name,
    date: member.date,
    reason: member.reason === "<no reason supplied>" ? null : member.reason,
    powerLevel: member.power,
  });
}
</script>
<style>
h1 {
  margin-bottom: 1em;
  font: 20px var(--font-display);
  font-weight: 500;
}

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
  <h1>{members ? members.length || "No" : "Loading"} Member{members.length !== 1 ? "s" : ""}</h1>
  {#if members}
    {#each members as member}
    <div class="member" on:click={() => showPopup(member)}>
      <img class="avatar" src={mxcToHttp(member.avatar)} alt="avatar for {member.rawDisplayName}"/>
      <div class="name">
        {member.name}
        <span style="color: var(--fg-muted); font-size: 14px">{member.userId}</span>
      </div>
      <div style="margin-left: auto;">{member.power}</div>
    </div>
    {:else}
    <p>nobody's here!</p>
    {/each}
  {/if}
{:else}
<i>something really wrong happened, try again?</i>
{/if}

{#if room}
<h1>{members.length || "No"} Ban{members.length !== 1 ? "s" : ""}</h1>
{#each members as member}
<div class="ban" on:click={() => showPopup(member)}>
  <img class="avatar" src={mxcToHttp(member.avatar)} alt="avatar for {member.name}"/>
  <div class="name">{member.name}</div>
</div>
{:else}
<p>no bans</p>
{/each}
{:else}
<i>something really wrong happened, try again?</i>
{/if}
