<script>
let invited = state.invitedRooms;
</script>
<style>
.rooms {
  margin: 4em;
}

.rooms > .room {
  display: flex;
  align-items: center;
  height: 62px;
  padding: 8px 2px;
  border-top: solid var(--color-gray) 1px;
}

.room > img {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  margin-right: 1em;
}

.room > .name {
  font-weight: bold;
  font-size: 18px;
}

.room > .options {
  margin-left: auto;
}

.button {
  display: inline-block;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  margin-left: 4px;
  background: var(--bg-spaces);
  cursor: pointer;
  overflow: hidden;
}

.button > div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  transition: all 0.2s;
  }

.button:hover > div {
  background: #00000033;
}
</style>
<div class="rooms">
  <b>invites - {$invited.length}</b>
  {#each $invited as room}
  <div class="room">
  <img src={room.getAvatarUrl(state.client.baseUrl)} />
  <span class="name">{room.name}</span>
  <div class="options">
    <div class="button" on:click={state.client.joinRoom(room.roomId)}><div>✅</div></div>
    <div class="button" on:click={state.client.leave(room.roomId)}><div>🚫</div></div>
  </div>
  </div>
  {/each}
</div>
