<script>
export let options;
export let selected;
export let changed = () => {};

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
  padding: 10px 8px;
  background: var(--bg-rooms-members);
  border-radius: 3px;
  cursor: pointer;
  border-left: solid transparent 3px;
}

.option:hover {
  background: rgba(4,4,5,0.07);
}

.option.selected {
  background: #40444b;
}

.option.disabled {
  background: rgba(4, 4, 5, 0.06);
  cursor: not-allowed;
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

.label {
  color: var(--fg-light);
}

.option:hover .label {
  color: var(--fg-content);
}

.option.selected .label {
  color: var(--fg-notice);
}

.name {
  font-weight: 500;
}

.detail {
  font-size: 14px;
  margin-top: 4px;
}
</style>
<div>
  {#each options as option}
    <div
      class="option"
      class:selected={selected === option.id}
      class:disabled={option.disabled}
      style:border-left-color={option.color}
      on:click={() => !option.disabled && select(option.id)}
    >
      <div class="dot">
        {#if selected === option.id}<div></div>{/if}
      </div>
      <div class="label">
        <div class="name">{option.name}</div>
        {#if option.detail}
        <div class="detail">{option.detail}</div>
        {/if}
      </div>
    </div>
  {/each}
</div>
