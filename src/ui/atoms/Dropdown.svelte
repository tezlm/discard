<script>
export let options;
export let selected = options[0];
export let changed = () => {};
let show = false;

function select(option) {
  selected = option;
  changed(option);
}
</script>
<style>
.option {
  display: flex;
  align-items: center;
  margin: 8px 0;
  padding: 10px;
  background: var(--bg-rooms-members);
  border-radius: 3px;
  cursor: pointer;
}

.option:hover {
  background: rgba(4,4,5,0.07);
}

.option.selected {
  background: #40444b;
}
</style>
<div class="container">
  <div class="dropdown" on:click={() => show = true} on:blur={() => show = false}>
    {options.find(i => i[1] === selected)?.[0]}
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
