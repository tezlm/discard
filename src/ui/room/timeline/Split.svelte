<script>
export let text, color = "var(--fg-muted)";
</script>
<style>
.split {
  margin-top: 1rem;
  padding: 2px 16px;
  display: flex;
  align-items: center;
}

.line {
  flex: 1;
  height: 1px;
}

.left {
  margin-right: .5rem;
}

.right {
  margin-left: .5rem;
}

.text {
  font-size: 14px;
  font-weight: 700;
}
</style>
<div class="split">
  <div class="line left" style="background: {color}"></div>
  <span class="text" style="color: {color}">{text}</span>
  <div class="line right" style="background: {color}"></div>
</div>
