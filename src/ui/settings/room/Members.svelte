<script>
let mxcToHttp = h => h?.replace(/mxc:\/\/([^/]+)\/(.+)/, `https://celery.eu.org/_matrix/media/r0/download/$1/$2`) // TODO: not hardcode this, split into module
export let room, membership;
let members = false;
$: setTimeout(async () => {
  if (!$room.members.ready) await $room.members.fetch();
  members = $room.members.get(membership)
});

function showPopup(member) {
  state.popup.set({
    id: "member",
    membership,
    member,
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
  <h1>{members ? members.length || "No" : "Loading"} {getTitle(membership)}{members.length !== 1 ? "s" : ""}</h1>
  {#if members}
    {#each members as member}
    <div class="member" on:click={() => showPopup(member)}>
      <img class="avatar" src={mxcToHttp(member.avatar)} alt="avatar for {member.name}" loading="lazy"/>
      <div class="name">
        {member.name}
        <span style="color: var(--fg-muted); font-size: 14px">{member.userId}</span>
      </div>
      {#if membership === "joined"}
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
