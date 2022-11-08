<script>
export let options;
export let selected = options[0][1];
export let changed = () => {};
let show = false;
let width;

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
  border-radius: 3px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: var(--bg-rooms-members);
  border: solid var(--bg-spaces) 1px;
  z-index: 1;
}

.option {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.option:hover {
  background: rgba(98, 98, 100, .1);
}

.option.selected {
  background: rgba(98, 98, 100, .2);
}

.arrow {
  position: relative;
  transition: all .1s;
  transform: scale(1.5);
}

.arrow.show {
  transform: scale(1.5) rotate(180deg);
}

.checkmark {
  margin-left: auto;
  color: var(--color-accent);
  transform: scale(1.2);
}
</style>
<div class="container" role="listbox">
  <!-- FIXME: close on blur -->
  <div class="dropdown" class:show on:click={() => show = !show} bind:clientWidth={width}>
    {options.find(i => i[1] === selected)?.[0]}
    <div class="arrow icon" class:show>expand_more</div>
  </div>
  {#if show}
  <div class="options" style:width={width + "px"}>
  {#each options as option}
    <div
      class="option"
      role="option"
      aria-selected={selected === option[1] }
      class:selected={selected === option[1]}
      on:click={() => select(option[1])}
    >
      <div class="label">
        {option[0]}
      </div>
      {#if option[1] === selected}
      <div class="checkmark icon" aria-hidden="true">check_circle</div>
      {/if}
    </div>
  {/each}
  </div>
  {/if}
</div>
