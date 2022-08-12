<script>
export let room;
</script>
<div style="margin: 2em auto;">
  <div style="border-radius: 4px; background: var(--bg-rooms-members); border: solid var(--bg-spaces) 1px; padding: 16px; display: inline-block; user-select: text;">
    <b>unknown room type</b>
    <p>i don't know how to render a <code>{room.state.find(i => i.type === "m.room.create").content.type}</code> room yet!</p>
  </div>
</div>
