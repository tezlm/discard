<script>
import Avatar from "../../atoms/Avatar.svelte";
import Button from "../../atoms/Button.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";

export let selectedTab;
let { invites, popup } = state;

function getInviteSender(invite) {  
  const myMemberEvent = invite.state.find(i => i.type === "m.room.member" && i.state_key === state.userId);
  const memberEvent = invite.state.find(i => i.type === "m.room.member" && i.state_key === myMemberEvent.sender)?.content;
  if (!memberEvent) return { id: myMemberEvent.sender, name: myMemberEvent.sender };
  return { id: myMemberEvent.sender, name: myMemberEvent.content.displayname ?? myMemberEvent.sender };
}

function join(invite) {
  invite.join();
  
  const interval = setInterval(() => {
    if (!state.rooms.has(invite.id)) return;
    if (invite.type === "m.space") {
      actions.spaces.focus(state.rooms.get(invite.id));
    } else {
      actions.rooms.focus(state.rooms.get(invite.id));
    }
    clearInterval(interval);
  }, 10);
}
</script>
<style>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.center h1 {
  text-align: center;
}

.buttons {
  display: grid;
  width: 608px;
  max-width: 50vw;
  grid-gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-top: 1em;
}

.button {
  display: flex;
  text-align: left;
}

.button .icon {
  font-size: 24px;
  margin-right: 16px;
}

.button .description {
  font-weight: normal;
}

.invites {
  padding: 16px;
}

.invites h2 {
  margin: 16px 8px;
}

.invite .info {
  flex: 1;
  margin: 0 8px;
  overflow: hidden;
}

.invite .info div {
  overflow: hidden;
  text-overflow: ellipsis;
}

.invite {
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 8px;
  border-top: solid var(--mod-lighten) 1px;
}

.invite:hover {
  background: var(--mod-lighten);
}

.invite button {
  height: 32px;
  width: 32px;
  margin-right: 8px;
  font-weight: 500;
  font-size: 24px;
  border: none;
  color: var(--fg-content);
  border-radius: 50%;
  background: var(--bg-rooms-members);
  transition: color background .2s;
}

.invite button:hover {
  background: var(--bg-spaces);
}

.invite button.accept:hover { color: var(--color-green) }
.invite button.reject:hover { color: var(--color-red) }

.invite button:active {
  transform: translateY(1px);
}

.dim {
  color: var(--fg-dim);
}

.small {
  font-size: 14px;
}
</style>
{#if selectedTab === "home"}
<div class="center">
  <div style="display: flex; flex-direction: column">
    <h1>welcome to discard!</h1>
    <div class="warning">discard is pre-alpha, expect things to break!</div>
    <div class="buttons">
      <Button clicked={() => $popup = { id: "create", type: "room" }}>
        <div class="button">
          <div class="icon">tag</div>
          <div style="flex: 1">
            <div>Create room</div>
            <div class="description">Create a chatroom to talk in</div>
          </div>
        </div>
      </Button>
      <Button clicked={() => $popup = { id: "create", type: "space" }}>
        <div class="button">
          <div class="icon">folder</div>
          <div style="flex: 1">
            <div>Create Space</div>
            <div class="description">Use spaces to organize rooms</div>
          </div>
        </div>
      </Button>
      <Button clicked={todo}>
        <div class="button">
          <div class="icon">person</div>
          <div style="flex: 1">
            <div>Start DM</div>
            <div class="description">Start a converation with someone</div>
          </div>
        </div>
      </Button>
      <Button clicked={todo}>
        <div class="button">
          <div class="icon">explore</div>
          <div style="flex: 1">
            <div>Explore Rooms</div>
            <div class="description">Find public rooms to talk in</div>
          </div>
        </div>
      </Button>
      <Button clicked={() => actions.to("/user-settings")}>
        <div class="button">
          <div class="icon">settings</div>
          <div style="flex: 1">
            <div>Open Settings</div>
            <div class="description">Set up and configure some stuff</div>
          </div>
        </div>
      </Button>
      <Button clicked={() => window.open("https://git.celery.eu.org/tezlm/discard")}>
        <div class="button">
          <div class="icon">code</div>
          <div style="flex: 1">
            <div>View Source</div>
            <div class="description">Check out the source code on gitea</div>
          </div>
        </div>
      </Button>
    </div>
    <div style="text-align: center; margin-top: 16px; color: var(--fg-light)">
      <b style="color: var(--color-green)">Pro Tip:</b> click the <span class="icon" style="cursor: pointer; position: relative; bottom: -2px" on:click={() => actions.to("/user-settings/help")}>help</span> icon in the upper right corner for help!
    </div>
  </div>
</div>
{:else if selectedTab === "invites"}
<div class="invites scroll">
  <h2>Invites - {$invites.size}</h2>
  {#each [...$invites.values()] as invite (invite.id)}
  {@const sender = getInviteSender(invite)}
  <div class="invite">
    <Avatar user={{ avatar: invite.avatar, id: invite.id }} size={36} />
    <div class="info">
      <div>{invite.name}{#if invite.topic}<span class="dim">- {invite.topic}</span>{/if}</div>
      <div class="small"><span class="dim">invited by </span>{sender.name} <span class="dim">({sender.id})</span></div>
    </div>
    <Tooltip tip="Accept">
      <button class="icon accept" on:click={() => join(invite)}>check</button>
    </Tooltip>
    <Tooltip tip="Reject">
      <button class="icon reject" on:click={() => invite.leave()}>close</button>
    </Tooltip>
  </div>
  {:else}
  <div style="padding: 8px;" class="dim">
    <i>no invites - come back later ᕕ( ᐛ )ᕗ </i>
  </div>
  {/each}
</div>
{/if}
