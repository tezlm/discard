<script>
export let value = "";
export let placeholder = "Search";
export let width;
export let autofocus = false;
export let focus = false;

function handleKeyDown(e) {
  if (e.key === "Escape" && value) {
    e.stopImmediatePropagation();
    e.preventDefault();
    value = "";
  }
}
</script>
<style>
.wrapper {
  display: inline-flex;
  position: relative;
  width: 160px;
  height: 24px;

  background: var(--bg-spaces);
  border-radius: 4px;

  transition: width .2s;
}

.wrapper.focus {
  width: 250px;
}

input {
  flex: 1;
  min-width: 0;
  padding: 0 6px;

  background: var(--bg-spaces);
  color: var(--fg-content);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  border: none;
  border-radius: 3px;
}

.icon {
  padding: 0 3px;
  color: var(--fg-dim);
  cursor: pointer;
  transition: all .1s;
}

.search {
  position: absolute;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.close {
  cursor: pointer;
  transform: rotate(-90deg);
}

.close:hover {
  color: var(--fg-notice);
}
</style>
<div class="wrapper" class:focus={focus || value} style:width={width + "px"}>
  <input
    type="text"
    {placeholder}
    {autofocus}
    bind:value={value}
    on:keydown={handleKeyDown}
    on:focus={() => focus = true}
    on:blur={() => focus = false}
  />
  <div
    class="icon"
    class:close={!!value}
    class:search={!value}
    on:click={() => value = ""}
  >
    {#if value}
      close
    {:else}
      search
    {/if}
  </div>
</div>
