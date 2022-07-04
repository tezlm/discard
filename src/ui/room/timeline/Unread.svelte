<script>
export let unpad;
</script>
<style>
.unread {
  padding: 2px 16px;
  display: flex;
  align-items: center;
  margin-bottom: -2px;
}

.unpad {
  margin-bottom: -1rem;
}

.line {
  flex: 1;
  height: 1px;
  margin-right: .5rem;
  background: var(--color-red);
}

.text {
  background: var(--color-red);
  color: var(--color-content);
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0 3px;
  border-radius: 2px;
}
</style>
<div class="unread" class:unpad>
  <div class="line"></div>
  <span class="text">new</span>
</div>
