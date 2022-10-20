<script>
import Input from "../../atoms/Input.svelte";
import Avatar from "../../atoms/Avatar.svelte";
import { parseHtml } from "../../../util/html.js";
export let room;
let members = false;

$: {
  room.members.fetch().then(() => {
    members = room.members.with("join", false);
  });  
}
  
function formatJoinRule(rule) {
  switch(rule) {
    case "public": return "Public space";
    case "invite": return "Private space";
    case "restricted": return "Subspace";
  }
}
</script>
<style>
.content {
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 32px;
  overflow-y: scroll;
  background: #2c2e33;
}

.main {
  max-width: 600px;
  width: 100%;
  margin: 0 16px;
}

.side {
  width: 100%;
  max-width: 320px;
  margin: 36px 16px;
}

.side > div {
  background: var(--bg-content);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.header {
  position: relative;
  user-select: text;
}

.header .avatar {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  border-radius: 8px;
  overflow: hidden;
}

.header h1 {
  overflow-wrap: anywhere;
  font-size: 24px;
}

.header .info {
  margin: .5rem 0;
  color: var(--fg-light);
  font-weight: 500;
}

.header .topic {
  line-height: 1.3;
}

.placeholder {
  background: var(--bg-rooms-members);
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<div class="content">
  <div class="main"> 
    <h3>Rooms</h3>
    <div style="height: 16px"></div>
    <Input placeholder="Search..." />
    <div style="height: 16px"></div>
    <div class="placeholder">
      <div>// TODO</div>
    </div>
  </div>
  <div class="side">
    <div class="header">
      <div class="avatar">
        <Avatar square user={room} size={72} />
      </div>
      <div style:height="24px"></div>
      <h1>{room.name}</h1>
      <div class="info">
        {formatJoinRule(room.joinRule)} ·
        {members?.length ?? "???"} {members?.length === 1 ? "member" : "members"} ·
        <a href="#" on:click={(e) => { e.preventDefault(); state.selectedRoom.set(room); state.scene.set("space-settings") }}>edit</a>
      </div>
      <div class="topic">{@html room.topic ? parseHtml(room.topic, { linkify: true }) : "<i>no topic</i>"}</div>
    </div>
    <div>
      <h3>Active now</h3>
      <br />
      <ul>
        <li>todo</li>
        <li>todo</li>
        <li>todo</li>
      </ul>
    </div>
  </div>
</div>
