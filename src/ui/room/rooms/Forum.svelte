<script>
import RoomTextarea from "../input/RoomTextarea.svelte";
export let room;

let posts = [];
for (let i = 0; i < 100; i++) posts.push({ title: `post ${i}`, body: `a body for post ${i}` });
</script>
<style>
.content {
  flex: 1;
  padding: 8px;
  background: #2c2e33;
}

.item {
  background: var(--bg-content);
  margin: 16px;
  padding: 16px;
  border-radius: 8px;
}

.create {
  padding: 0 16px;
  display: flex;
}
</style>
<div class="content scroll">
  <div class="item create">
    <RoomTextarea placeholder="Create post" />
  </div>
  {#each posts as post}
    <div class="item">
      <h2>{post.title}</h2>
      {post.body}
    </div>
  {/each}
</div>
