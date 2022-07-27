<script>
export let fetchBackwards = async () => {};
export let fetchForwards = async () => {};
export let getDefault = () => {};
export let scrollTop, scrollMax;
export let items, itemKey;
export let margin = 400;
export let direction = "down";
export let scrollEl;
let debounce;
let contentEl;
let atItemsTop, atItemsBottom;
let paginating = false;

export function reset() {
  [atItemsTop, atItemsBottom] = getDefault();
  if (direction === "down") {
    queueMicrotask(() => scrollEl && (scrollEl.scrollTop = scrollEl.scrollHeight));
  }
}

export function scrollTo(pos) {
  if (scrollEl) scrollEl.scrollTop = pos === -1 ? scrollEl.scrollHeight : pos;
}

function handleScroll() {
  scrollTop = scrollEl.scrollTop;
  scrollMax = scrollEl.scrollHeight - scrollEl.offsetHeight;
  if (paginating) return;
  clearTimeout(debounce);
  debounce = setTimeout(paginate, 20);
}

// FIXME: sometimes fails to set scroll posititon, causing jumps up on room change
// FIXME: pagination sometimes jumps around when scrolling up
// possibly due to messages "merging together"
async function paginate() {
  if (paginating || !contentEl) return;
  paginating = true;

  const scrollTop = scrollEl.scrollTop;
  const scrollBottom = scrollEl.scrollHeight - scrollEl.offsetHeight - scrollTop;
  const atScrollTop = scrollTop < margin + contentEl.offsetTop;
  const atScrollBottom = scrollBottom < margin + (scrollEl.scrollHeight - contentEl.offsetTop - contentEl.offsetHeight);
    console.log(scrollTop, margin + contentEl.offsetTop, atScrollTop)

  if (atScrollTop && !atItemsTop) {
    console.log("paginate backwards")
    const childNode = contentEl.children[0];
    const scrollPos = childNode?.offsetTop;
    [atItemsTop, atItemsBottom] = (await fetchBackwards() ?? [false, false]);
    if (childNode) queueMicrotask(() => scrollEl.scrollTop = scrollTop + childNode.offsetTop - scrollPos);
  } else if (atScrollBottom && !atItemsBottom) {
    console.log("paginate forwards")
    const childNode = contentEl.children[contentEl.children.length - 1];
    const scrollPos = childNode?.offsetTop;
    [atItemsTop, atItemsBottom] = (await fetchForwards() ?? [false, false]);
    if (childNode) queueMicrotask(() => scrollEl.scrollTop = scrollTop + childNode.offsetTop - scrollPos);
  }

  queueMicrotask(() => paginating = false);
}

queueMicrotask(reset);
</script>
<style>
.scroll {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
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
  {#each items as item, i (item[itemKey])}
  <slot data={item} index={i} />
  {/each}
  </div>
  
  {#if atItemsBottom}
  <slot name="bottom" />
  {:else}
  <slot name="placeholder-end" />
  {/if}
</div>
