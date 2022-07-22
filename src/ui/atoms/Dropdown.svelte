<script>
export let options;
export let selected = options[0][1];
export let changed = () => {};
let show = false;

function select(option) {
  show = false;
  selected = option;
  changed(option);
}
</script>
<style>
.container {
  position: relative;
  user-select: none;
}

.dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 3px;
  background: var(--bg-spaces);
  cursor: pointer;
}

.dropdown.show {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.options {
  position: absolute;
  width: 100%;
  border-radius: 3px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: var(--bg-context);
}

.option {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

/* TODO: this code is wayy to hacky, get svg? */
.arrow {
  position: relative;
  margin-right: 8px;
  transition: all .1s;
}

.arrow.show {
  transform: rotate(180deg);
}

.arrow::after, .arrow::before {
  content: "";
  display: block;
  position: absolute;
  top: 2px;
  right: -4px;
  width: 8px;
  height: 2px;
  background: var(--fg-notice);
}

.arrow::before {
  transform: rotate(-45deg) translateX(3px);
}

.arrow::after {
  transform: rotate(45deg) translateX(-3px);
}
</style>
<div class="container">
  <!-- FIXME: close on blur -->
  <div class="dropdown" class:show on:click={() => show = !show}>
    {options.find(i => i[1] === selected)?.[0]}
    <div class="arrow" class:show></div>
  </div>
  {#if show}
  <div class="options">
  {#each options as option}
    <div class="option" class:selected={selected === option[1]} on:click={() => select(option[1])}>
      <div class="label">
        {option[0]}
      </div>
    </div>
  {/each}
  </div>
  {/if}
</div>
