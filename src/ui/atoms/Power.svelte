<script lang="ts">
// this code is quite hacky and should be cleaned up someday...

export let disabled = false;
export let value = 0;
export let max = 100;
export let changed = (_: number) => {};
let newVal = value;
let focus = false;
let inputEl: HTMLInputElement;

function setPower(level: number) {
  queueMicrotask(() => newVal = level);
  changed(level);
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    newVal = value;
    focus = false;
    inputEl.blur();
  } else if (e.key === "Enter") {
    if (newVal !== value) setPower(newVal);
    focus = false;
    inputEl.blur();
  }
}

function handleBlur() {
  if (newVal !== value) setPower(newVal);
  focus = false;
}

function handleFocus() {
  focus = true;
}

export function reset() {
  newVal = value;
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
  padding: 4px 8px;
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
      bind:value={newVal}
      bind:this={inputEl}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown|stopPropagation={handleKeyDown}
    >
    <div class="options">
      <hr />
      {#if max >= 0}  <div on:mousedown={() => setPower(0)}    class:selected={newVal === 0}>User - 0</div> {/if}
      {#if max >= 50} <div on:mousedown={() => setPower(50)}   class:selected={newVal === 50}>Moderator - 50</div> {/if}
      {#if max >= 100}<div on:mousedown={() => setPower(100)}  class:selected={newVal === 100}>Admin - 100</div> {/if}
    </div>
  </div>
</div>
