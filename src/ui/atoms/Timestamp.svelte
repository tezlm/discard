<script>
import { formatDate, formatTime } from "../../util/format.js";
export let time, format = "date", display = "inline";
let formatted = (format === "date" ? formatDate : formatTime)(time);
</script>
<style>
.timestamp {
  color: var(--fg-muted);
  font-size: 0.6875rem;
  text-align: right;
}
</style>
<time datetime={time.toISOString()} style="display: {display}" class="timestamp">{formatted}</time>
