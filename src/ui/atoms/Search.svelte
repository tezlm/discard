<script>
export let value = "";
export let placeholder = "Search";
export let width = 200;
export let autofocus = false;
export let optional = false;
export let submitted = () => {};

function handleKeyDown(e) {
  if (e.key === "Enter") {
    e.stopImmediatePropagation();
    e.preventDefault();
    if (value || optional) submitted(value, e);
  } else if (e.key === "Escape" && value) {
    e.stopImmediatePropagation();
    e.preventDefault();
    value = "";
  }
}

function spin(_) {
  return {
    duration: 100,
    css: t => `transform: rotate(${t * 90}deg)`,
  }
}

function spinrev(_) {
  return {
    duration: 100,
    css: t => `transform: rotate(${90 - t * 90}deg)`,
  }
}
</script>
<style>
.wrapper {
  display: inline-flex;
  border-radius: 3px;
  color: inherit;
  background: var(--bg-spaces);
  padding: 0 4px;
}

input {
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  width: 140px;
  padding: 0 2px;
  height: 24px;
  border: none;
  border-radius: 3px;
  color: var(--fg-content);
  background: var(--bg-spaces);
  outline: none;
  transition: width .2s;
}

input:focus {
  width: 240px;
}

.icon {
  color: var(--fg-dim);
  transition: transform .1s;
}
</style>
<div class="wrapper">
  <input
    type="text"
    {placeholder}
    {autofocus}
    style:width={width + "px"}
    bind:value={value}
    on:keydown={handleKeyDown}
  />
  {#if value}
  <div class="icon close" in:spin>close</div>
  {:else}
  <div class="icon search" in:spinrev>search</div>
  {/if}
</div>
