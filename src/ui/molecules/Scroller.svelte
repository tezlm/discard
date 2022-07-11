<script>
export let fetchBackwards = async () => {};
export let fetchForwards = async () => {};
export let scrollTop, scrollMax;
export let items, indexKey;
export let margin = 400;
export let direction = "down";
let debounce;
let contentEl, scrollEl;
let atItemsTop = direction === "up";
let atItemsBottom = direction === "down";

export function scrollTo(pos) {
  if (!scrollEl) return;
  scrollEl.scrollTop = pos === -1 ? scrollEl.scrollHeight : pos;
}

function handleScroll() {
  scrollTop = scrollEl.scrollTop;
  scrollMax = scrollEl.scrollHeight - scrollEl.offsetHeight;
  clearTimeout(debounce);
  debounce = setTimeout(paginate, 30);
}

// TODO: pagination sometimes jumps around
async function paginate() {
  console.log("paginate")

  const scrollTop = scrollEl.scrollTop;
  const scrollBottom = scrollEl.scrollHeight - scrollEl.offsetHeight - scrollTop;
  const atScrollTop = scrollTop < margin + contentEl.offsetTop;
  const atScrollBottom = scrollBottom < margin + (scrollEl.scrollHeight - contentEl.offsetTop - contentEl.offsetHeight);

  if (atScrollTop && !atItemsTop) {
    const childNode = contentEl.children[0];
    const scrollPos = childNode.offsetTop;
    [atItemsTop, atItemsBottom] = (await fetchBackwards() ?? [false, false]);
    queueMicrotask(() => scrollEl.scrollTop = scrollTop + childNode.offsetTop - scrollPos);
  } else if (atScrollBottom && !atItemsBottom) {
    const childNode = contentEl.children[contentEl.children.length - 1];
    const scrollPos = childNode.offsetTop;
    [atItemsTop, atItemsBottom] = (await fetchForwards() ?? [false, false]);
    scrollEl.scrollTop = scrollTop + childNode.offsetTop - scrollPos;
  }
}

queueMicrotask(() => {
  if (direction === "down") {
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }
});
</script>
<style>
.scroll {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: none;
  overflow-y: auto;
}
</style>
<div
  class="scroll" 
  on:scroll={handleScroll}
  bind:this={scrollEl}
>
  {#if atItemsTop}
  <slot name="top" />
  {:else}
  <slot name="placeholder-start" />
  {/if}
  <div class="items" bind:this={contentEl}>
  {#each items as item, i (item[indexKey])}
  <slot data={item} index={i} />
  {/each}
  </div>
  {#if atItemsBottom}
  <slot name="bottom" />
  {:else}
  <slot name="placeholder-end" />
  {/if}
</div>
