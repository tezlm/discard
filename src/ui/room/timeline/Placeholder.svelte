<script>
const placeholders = [];

// i just picked whatever numbers looked good lol
for (let i = 0; i < 12; i++) {
  const holder = {
    header: Math.random() > .5,
    attachment: Math.random() > .8,
    content: [],
    author: [],
  };
  
  for (let i = 0; i < Math.random() * .5 + 1; i++) {
    holder.author.push({ width: Math.random() * 50 + 30 });
  }

  for (let i = 0; i < Math.random() * 10 + 5; i++) {
    holder.content.push({ width: Math.random() * 100 + 50 });
  }
  
  if (holder.attachment) {
    holder.attachment = {
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
    }
  }
  
  placeholders.push(holder);
}
</script>
<style>
.placeholder {
  padding: 0 16px;
  display: flex;
  margin: 8px 0;
}

.header {
  margin-top: 24px;
}

.avatar {
  width: 40px;
}

.header > .avatar {
  height: 40px;
  border-radius: 50%;
  background: var(--color-gray);
}

.content {
  margin: 0 16px;
  flex: 1;
  text-align: left;
}

.content .block {
  height: 16px;
  background: var(--bg-rooms-members);
  display: inline-block;
  margin-right: 8px;
  border-radius: 16px;
}

.content .block.author {
  background: var(--color-gray);
}

.content .attachment {
  width: 400px;
  height: 300px;
  border-radius: 4px;
  background: var(--bg-rooms-members);
  margin-top: 8px;
}
</style>
<div>
  {#each placeholders as holder}
  <div class="placeholder" class:header={holder.header}>
    <div class="avatar"></div>
    <div class="content">
      {#if holder.header}
        {#each holder.author as author}
        <div class="block author" style:width={author.width + "px"}></div>
        {/each}
        <div style="margin-top: 8px"></div>
      {/if}
      {#each holder.content as content}
      <div class="block" style:width={content.width + "px"}></div>
      {/each}
      {#if holder.attachment}
      <div class="attachment" style:width={holder.attachment.width + "px"} style:height={holder.attachment.height + "px"}></div>
      {/if}
    </div>
    </div>
  {/each}
</div>
