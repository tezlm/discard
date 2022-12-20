<script>
import Search from "../../atoms/Search.svelte";
import Avatar from "../../atoms/Avatar.svelte";
import Loading from "../../atoms/Loading.svelte";
import Hierarchy from "../space/Hierarchy.svelte";
import { parseHtml } from "../../../util/html";
export let room;
let members = false;

$: hierarchy = room.hierarchy().then(res => res.all());

$: {
  room.members.fetchAll("join").then(() => {
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

function buildTree(rooms, top = rooms[0], topEvent = null) {
  const item = { room: top, event: topEvent, children: [] };
  for (let event of top.childrenState) {
    if (!event.content.via?.length) continue;
    
    const room = rooms.find(i => i.id === event.state_key);
    if (!room) continue;
    if (room.type === "m.space") {
      item.children.push(buildTree(rooms, room, event));
    } else {
      item.children.push({ room, event });
    }
  }

  item.children.sort(actions.spaces.orderSpaceRooms);
  
  return item;
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
  margin: 0 8px;
}

.side {
  width: 100%;
  max-width: 320px;
  margin: 36px 8px;
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

.rooms {
  background: var(--bg-rooms-members);
  min-height: 400px;
  padding: 8px;
  margin-bottom: 16px;
}

.loading {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
<div class="content">
  <div class="main"> 
    <h3>Rooms</h3>
    <div style="height: 16px"></div>
    <Search size="tall" placeholder="Search..." />
    <div style="height: 16px"></div>
    <div class="rooms">
    {#await hierarchy}
    <div class="loading">
      <Loading />
      <i style="margin-top: 8px; color: var(--fg-light)">Loading rooms...</i>
    </div>
    {:then rooms}
      <Hierarchy item={buildTree(rooms)} />
    {/await}
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
        <a href="#" on:click={(e) => { e.preventDefault(); state.selectedRoom.set(room); actions.to(`/space-settings/${room.id}`) }}>edit</a>
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
