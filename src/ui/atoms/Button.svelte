<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { fastclick } from "../../util/use";
export let label: string | undefined;
export let type = "normal";
export let clicked = () => {}; // TODO: remove (use dispatcher)
export let disabled = false;
export let loading = false;
$: standard = ["normal", "primary", "gray", "good", "warn", "danger"].some(i => type.split(" ").includes(i)) && !type.includes("hollow");

const dispatch = createEventDispatcher();
</script>
<style>
button {
  position: relative;
  display: inline-block;
  border-radius: 3px;
  color: var(--fg-notice);
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 170ms;
}

button:focus {
  outline: solid var(--color-accent) 3px;
}

:not(.link) {
  min-width: 5rem;
}

.standard::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  background: #00000000;
  transition: all 170ms;
}

.big {
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
}

.small {
  padding: 8px 16px;
  min-width: 4rem;
}

.hollow {
  background: transparent;
  border: solid var(--button-outline) 1px;
}

.normal.standard { background: var(--bg-misc) }
.primary.standard { background: var(--color-accent) }
.gray.standard { background: var(--color-gray-light) }
.good.standard { background: var(--color-green) }
.warn.standard { background: var(--color-yellow) }
.danger.standard { background: var(--color-red) }

.normal.hollow { border-color: var(--bg-misc) }
.primary.hollow { border-color: var(--color-accent) }
.gray.hollow { border-color: var(--color-gray-light) }
.good.hollow { border-color: var(--color-green) }
.warn.hollow { border-color: var(--color-yellow) }
.danger.hollow { border-color: var(--color-red) }

.link {
  background: transparent;
}

.hollow:hover, .hollow:focus { background: var(--button-outline) }
.normal.hollow:hover, .normal.hollow:focus { background: var(--bg-misc) }
.primary.hollow:hover, .primary.hollow:focus { background: var(--color-accent) }
.gray.hollow:hover, .gray.hollow:focus { background: var(--color-gray-light) }
.good.hollow:hover, .good.hollow:focus { background: var(--color-green) }
.warn.hollow:hover, .warn.hollow:focus { background: var(--color-yellow) }
.danger.hollow:hover, .danger.hollow:focus { background: var(--color-red) }
.standard:hover::after, .standard:focus::after { background: #00000033 }
.link:hover, .link:focus { text-decoration: underline }

.disabled { cursor: not-allowed }
.loading { cursor: progress }
.hollow.disabled { border: solid var(--button-outline) 1px; }
.hollow.disabled:hover, .hollow.disabled:focus { background: none }
.hollow.loading:hover, .hollow.loading:focus { background: none }
.standard.disabled::after { background: #00000055 }
.standard.loading::after { background: #00000055 }
</style>
<button
  disabled={disabled || loading}
  class={type}
  class:standard
  class:disabled
  class:loading
  use:fastclick
  on:fastclick={clicked}
  on:fastclick={() => dispatch("click")}
>
  {#if label}
  {label}
  {:else}
  <slot></slot>
  {/if}
</button>
