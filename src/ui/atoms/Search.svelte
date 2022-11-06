<script type="ts">
export let value = "";
export let placeholder = "Search";
export let autofocus = false;
export let focus = false;
export let size: "small" | "input" | "tall" = "small";
export let submitted: (_: string, _1: KeyboardEvent) => void | null = null;
export let escaped: ((_: KeyboardEvent) => void) | null = null;

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    if (submitted) {
      submitted(value, e);
    } else {
      return;
    }
  } else if (e.key === "Escape") {
    if (value) {
      value = "";
    } else if (escaped) {
      escaped(e);
    } else {
      return;
    }
  } else {
    return;
  }
  e.stopPropagation();
  e.preventDefault();
}
</script>
<style>
.wrapper {
  display: inline-flex;
  position: relative;
  width: 100%;
  height: 24px;

  background: var(--bg-spaces);
  border-radius: 3px;
}

input {
  flex: 1;
  min-width: 0;
  padding: 0 6px;

  background: var(--bg-spaces);
  font-size: 14px;
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

.wrapper.size-tall {
  height: 40px;
}

.wrapper.size-tall input {
  padding: 10px;
  font-size: 16px;
}

.wrapper.size-tall .icon {
  padding: 10px;
  font-size: 20px;
}

.wrapper.size-input {
  height: 28px;
}

.wrapper.size-input input {
  padding: 14px 8px;
}

.wrapper.size-input .icon {
  padding: 14px 6px;
  font-size: 18px;
}
</style>
<div class="wrapper" class:size-tall={size === "tall"} class:size-input={size === "input"}>
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
