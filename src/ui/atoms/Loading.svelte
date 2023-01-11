<script>
export let color = "var(--fg-muted)";
export let size = 32;
</script>
<style>
@keyframes hover {
  0% { transform: translateY(5px) }
  50% { transform: translateY(-5px) }
  100% { transform: translateY(5px) }
}

.spinner {
  /* background: conic-gradient(var(--mxid-2), var(--mxid-3), var(--mxid-4), var(--mxid-5), var(--mxid-2)); */
  border: solid var(--fg-muted) 4px;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: spin 1.3s infinite cubic-bezier(.4, -0.17, .53, 1.14);
}

@keyframes spin {
  from { transform: rotate(0) }
  to { transform: rotate(3turn) }
}
</style>
<div
  class="spinner"
  style:width="{size}px"
  style:height="{size}px"
  style:border-left-color={color}
  style:border-right-color={color}
></div>
