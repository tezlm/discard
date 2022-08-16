<script>
export let room;

let media = [
  { name: "foo", url: "" },
  { name: "bar", url: "" },
  { name: "baz", url: "" },
];

for (let i = 0; i < 10; i++) media.push({ name: `media ${i}`, url: "" });
</script>
<style>
.content {
  flex: 1;
  display: grid;
  /* todo: auto-fit items */
  grid-template-columns: repeat(4, minmax(300px, 1fr));
  grid-template-rows: repeat(4, 260px);
  padding: 8px;
  background: #2c2e33;
}

.item {
  display: flex;
  flex-direction: column;
  margin: 8px;
  padding: 8px;
  background: var(--bg-content);
  border-radius: 3px;
  cursor: pointer;
  transition: background .2s;
}

.item:hover {
  background: var(--bg-rooms-members);
}

.upload .icon {
  flex: 1;
  font-size: 64px;
  color: var(--fg-muted);
  cursor: pointer;
  transition: color .2s;
}

.upload:hover .icon {
  color: var(--fg-notice);
}
</style>
<div class="content scroll">
  {#each media as item}
    <div class="item">
      {item.name}
    </div>
  {/each}
  <div class="item upload">
    <div class="icon">add_circle</div>
    upload another
  </div>
</div>
