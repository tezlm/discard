<script lang="ts">
// export let default = null;
export let showDefault = false;
export let disabled = false;
export let value = 0;
export let max = 100;
export let changed = (_: number) => {};
let original = value;
let focus = false;
let inputEl: HTMLInputElement;

$: changed(value);

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    value = original;
    focus = false;
    e.stopImmediatePropagation();
    inputEl.blur();
  } else if (e.key === "Enter") {
    focus = false;
    e.stopImmediatePropagation();
    inputEl.blur();
  }
}
</script>
<style>
.wrapper {
  position: relative;
  height: 40px;
  width: 160px;
}

.selector {
  display: inline-block;
  position: absolute;
  padding: 10px;

  font-family: var(--font-primary);
  font-size: 16px;
  border-radius: 3px;
  color: inherit;
  transition: all 100ms;
}

.selector.focus {
  background: var(--bg-rooms-members);
  box-shadow: var(--shadow-popup);
  z-index: 1;
}

input {
  border: none;
  outline: none;
  padding: 4px;
  border-radius: 3px;
  width: 100%;

  font-family: var(--font-primary);
  font-size: 16px;
  color: var(--fg-notice);
  background: transparent;
  text-align: right;

  transition: all 100ms;
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.options {
  display: none;
}

.options div {
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;
}

.options div:hover {
  background: var(--bg-spaces);
}

.options div.selected {
  color: var(--color-accent);
}

.selector:hover input:not([disabled]) {
  background: var(--bg-rooms-members);
}

.selector.focus input:not([disabled]) {
  background: var(--bg-spaces);
}

.selector.focus .options {
  display: block;
}
</style>
<div class="wrapper">
  <div class="selector" class:focus>
    <input
      {disabled}
      {max}
      type="number"
      placeholder={disabled ? "" : "edit"}
      bind:value={value}
      bind:this={inputEl}
      on:focus={() => focus = !disabled}
      on:blur={() => focus = false}
      on:keydown={handleKeyDown}
    >
    <div class="options">
      <hr />
      {#if showDefault}
      <div on:mousedown={() => value = null} class:selected={value === null}>Default</div>
      {/if}
      {#if max >= 0}
      <div on:mousedown={() => value = 0}    class:selected={value === 0}>User - 0</div>
      {/if}
      {#if max >= 50}
      <div on:mousedown={() => value = 50}   class:selected={value === 50}>Moderator - 50</div>
      {/if}
      {#if max >= 100}
      <div on:mousedown={() => value = 100}  class:selected={value === 100}>Admin - 100</div>
      {/if}
    </div>
  </div>
</div>
