<script>
export let options;
export let selected;
export let changed;

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

.dot {
  position: relative;
  height: 20px;
  width: 20px;
  padding: 4px;
  border: solid var(--fg-light) 2px;
  border-radius: 50%;
  margin-right: 8px;
}

.dot > div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  height: 10px;
  width: 10px;
  background: var(--fg-light);
  border-radius: 50%;
}
</style>
<div>
  {#each options as option}
    <div class="option" class:selected={selected === option[1]} on:click={() => select(option[1])}>
      <div class="dot">
        {#if selected === option[1]}<div></div>{/if}
      </div>
      <div class="label">
        {option[0]}
      </div>
    </div>
  {/each}
</div>
