<script>
export let fetchBackwards = async () => {};
export let fetchForwards = async () => {};
export let items, indexKey;
export let margin = 400;
export let direction = "down";
let debounce;
let contentEl, scrollEl;
let atItemsTop = direction === "up";
let atItemsBottom = direction === "down";

function handleScroll() {
  clearTimeout(debounce);
  debounce = setTimeout(paginate, 100);
}

async function paginate() {
  const scrollTop = scrollEl.scrollTop;
  const scrollBottom = scrollEl.scrollHeight - scrollEl.offsetHeight - scrollTop;
  const atScrollTop = scrollTop < margin + contentEl.offsetTop;
  const atScrollBottom = scrollBottom < margin + (scrollEl.scrollHeight - contentEl.offsetTop - contentEl.offsetHeight);

  if (atScrollTop && !atItemsTop) {
    const childNode = contentEl.children[0];
    const scrollPos = childNode.offsetTop;
    [atItemsTop, atItemsBottom] = (await fetchBackwards() ?? [false, false]);
    // scrollEl.scrollTop = scrollEl.scrollHeight;
    scrollTo(scrollEl.scrollTop + childNode.offsetTop - scrollPos);
    console.log(scrollEl.scrollTop + childNode.offsetTop - scrollPos, scrollEl.scrollTop, scrollEl.scrollHeight)
  } else if (atScrollBottom && !atItemsBottom) {
    [atItemsTop, atItemsBottom] = (await fetchForwards() ?? [false, false]);
  }
}

// TODO: find a fix to underlying problem that makes me need to many queuemicrotasks
// race condition?
function scrollTo(pos) {
  scrollEl?.scrollTo(0, pos);
  queueMicrotask(() => scrollEl?.scrollTo(0, pos));
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
