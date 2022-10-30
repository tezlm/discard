<script lang="ts">
import { fastclick } from "../../util/use";
export let label: string | undefined;
export let type = "normal";
export let clicked = () => {};
export let disabled = false;
export let loading = false;
$: standard = ["normal", "primary", "good", "warn", "danger"].some(i => type.split(" ").includes(i)) && !type.includes("hollow");
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
  padding: 6px 16px;
}

.hollow {
  background: transparent;
  border: solid var(--button-outline) 1px;
}

.normal:not(.hollow) { background: var(--bg-misc) }
.primary:not(.hollow) { background: var(--color-accent) }
.good:not(.hollow) { background: var(--color-green) }
.warn:not(.hollow) { background: var(--color-yellow) }
.danger:not(.hollow) { background: var(--color-red) }

.normal.hollow { border-color: var(--bg-misc); }
.primary.hollow { border-color: var(--color-accent); }
.good.hollow { border-color: var(--color-green); }
.warn.hollow { border-color: var(--color-yellow); }
.danger.hollow { border-color: var(--color-red); }

.link {
  background: transparent;
}

.hollow:hover { background: var(--button-outline) }
.normal.hollow:hover { background: var(--bg-misc) }
.primary.hollow:hover { background: var(--color-accent) }
.good.hollow:hover { background: var(--color-green) }
.warn.hollow:hover { background: var(--color-yellow) }
.danger.hollow:hover { background: var(--color-red) }
.standard:hover::after { background: #00000033 }
.link:hover { text-decoration: underline }

.disabled { cursor: not-allowed }
.loading { cursor: progress }
.hollow.disabled { border: solid var(--button-outline) 1px; }
.hollow.disabled:hover { background: none }
.hollow.loading:hover { background: none }
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
>
  {#if label}
  {label}
  {:else}
  <slot></slot>
  {/if}
</button>
