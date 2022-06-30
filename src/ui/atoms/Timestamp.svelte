<script>
export let time, format = "date", display = "inline";
let formatted = (format === "date" ? formatDate : formatTime)(time);

function isSameDay(date1, date2) {
  return (date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear())
}

function formatTime(d) {
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  return d.toLocaleTimeString(undefined, timeOptions);
}

function formatDate(d) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (isSameDay(d, today)) {
    return `Today at ${formatTime(d)}`
  }

  if (isSameDay(d, yesterday)) {
    return `Yesterday at ${formatTime(d)}`
  }

  return d.toLocaleDateString()
}
</script>
<style>
.timestamp {
  color: var(--fg-muted);
  font-size: 0.6875rem;
  text-align: right;
}
</style>
<time datetime={time.toISOString()} style="display: {display}" class="timestamp">{formatted}</time>
