<script>
// considering there is only one place that uses/needs this (room content), this may just be a useless abstraction
// this could be combined with room content to make a room timeline scroller instead
// import { afterUpdate, beforeUpdate, onMount, onDestroy } from "svelte";
export let fetchBackwards = async () => {};
export let fetchForwards = async () => {};
export let getDefault = () => {};
export let scrollTop, scrollMax;
export let items;
export let margin = 400;
export let direction = "down";
export let scrollEl;
let debounce;
let contentEl;
let atItemsTop, atItemsBottom;
let paginating = false;

export function reset() {
  [atItemsTop, atItemsBottom] = getDefault();
  if (direction === "up") scrollTo(-1);
}

export function scrollTo(pos) {
  if (scrollEl) {
    scrollEl.scrollTop = pos === -1 ? scrollEl.scrollHeight : pos;
  } else {
    console.warn("couldn't find scrollEl", scrollEl);
  }
}

function handleScroll() {
  scrollTop = this.scrollTop;
  scrollMax = this.scrollHeight - this.offsetHeight;
  if (paginating) return;
  clearTimeout(debounce);
  debounce = setTimeout(paginate, 20);
}

// FIXME: pagination sometimes jumps around when scrolling up
async function paginate() {
  if (paginating || !contentEl) return;
  paginating = true;

  const scrollTop = scrollEl.scrollTop;
  const scrollBottom = scrollEl.scrollHeight - scrollEl.offsetHeight - scrollTop;
  const atScrollTop = scrollTop < (margin + contentEl.offsetTop);
  const atScrollBottom = scrollBottom < (margin + (scrollEl.scrollHeight - contentEl.offsetTop - contentEl.offsetHeight));

  if (atScrollTop && !atItemsTop) {
    state.log.debug("paginate backwards");
    const childNode = contentEl.children[0];
    const scrollPos = childNode?.offsetTop;
    [atItemsTop, atItemsBottom] = (await fetchBackwards() ?? [false, false]);
    if (document.body.contains(childNode)) queueMicrotask(() => scrollEl.scrollTop = scrollTop + childNode.offsetTop - scrollPos);
  } else if (atScrollBottom && !atItemsBottom) {
    state.log.debug("paginate forwards");
    const childNode = contentEl.children[contentEl.children.length - 1];
    const scrollPos = childNode?.offsetTop;
    [atItemsTop, atItemsBottom] = (await fetchForwards() ?? [false, false]);
    if (document.body.contains(childNode)) queueMicrotask(() => scrollEl.scrollTop = scrollTop + childNode.offsetTop - scrollPos);
  }

  paginating = false;
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
  id="scrollTEMPIDWILLBEREMOVED"
  class="scroll"
  on:scroll={handleScroll}
  bind:this={scrollEl}
>
  {#if atItemsTop}
  <slot name="top" />
  {:else}
  <slot name="placeholder-start" />
  {/if}

  <div bind:this={contentEl}>
    {#each items as item, i (item.id)}
    <slot data={item} index={i} />
    {/each}
  </div>

  {#if atItemsBottom}
  <slot name="bottom" />
  {:else}
  <slot name="placeholder-end" />
  {/if}
</div>
