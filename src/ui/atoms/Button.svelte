<script>
export let type = "normal";
export let label = "button";
export let clicked = () => {};
export let disabled = false;
export let loading = false;
$: standard = ["normal", "primary", "danger"].some(i => type.split(" ").includes(i));
</script>
<style>
button {
  position: relative;
  font: inherit;
  border-radius: 3px;
  border: none;
  color: var(--fg-notice);
  cursor: pointer;
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

.normal { background: var(--bg-misc) }
.primary { background: var(--color-accent) }
.danger { background: var(--color-red) }

.link {
  background: transparent;
}

.hollow {
  background: transparent;
  border: solid var(--button-outline) 1px;
}

.standard:hover::after { background: #00000033 }
.link:hover { text-decoration: underline }
.hollow:hover { background: var(--button-outline) }

.disabled { cursor: not-allowed }
.loading { cursor: progress }
.standard.disabled::after { background: #00000055 }
.standard.loading::after { background: #00000055 }
</style>
<button
  disabled={disabled || loading}
  class={type}
  class:standard
  class:disabled
  class:loading
  on:click={clicked}
>
  {label}
</button>
