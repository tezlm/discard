<script>
export let unpad;
export let unread;
export let newdate;
</script>
<style>
.divider {
  display: flex;
  align-items: center;
  margin-bottom: -2px;
  height: 0;
}

.unread {
  padding: 8px 16px 8px 8px;
}

.newdate {
  padding: 16px 8px;
}

.unpad {
  margin-bottom: -1rem;
}

.line {
  flex: 1;
  height: 1px;
  margin: 0 .5rem;
  background: var(--color-gray);
}

.text, .new {
  color: var(--fg-muted);
  font-size: 12px;
  font-weight: 700;
  padding: 0 3px;
}

.unread .line {
  background: var(--color-red);
}

.unread .text {
  color: var(--color-red);
}

.new {
  font-family: var(--font-display);
  font-size: 10px;
  text-transform: uppercase;
  background: var(--color-red);
  color: var(--color-content);
  border-radius: 2px;
  }
</style>
{#if unread || newdate}
<div class="divider" class:unread class:newdate class:unpad>
  <div class="line"></div>
  {#if newdate}
    <span class="text">{newdate.toLocaleDateString()}</span>
    <div class="line"></div>
  {/if}
  {#if unread}
    <span class="new">new</span>
  {/if}
</div>
{/if}
