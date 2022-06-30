<script>
export let content, author, avatarurl, timestamp;
export let header = false;
$: timediff = Date.now() - timestamp;
$: time = {
  iso: timestamp.toISOString(),
  day: formatTime(timestamp),
  human: formatDate(timestamp),
}

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
.message {
  display: flex;
  padding: 2px 72px;
  margin-top: 0;
  position: relative;
  color: var(--fg-content);
}

.message:hover {
    background: rgba(4,4,5,0.07);
}

.header {
  margin-top: 1em;
}

.content {
  color: var(--fg-content);
}

.author {
	font-weight: bold;
	cursor: pointer;
  margin-right: 0.25rem;
}

.author:hover {
	text-decoration: underline;
}

.side {
  position: absolute;
  display: inline-block;
  left: 16px;
  margin-right: 8px;
}

.avatar {
  border-radius: 50%;
  height: 40px;
}

.timestamp {
  display: none;
  color: var(--fg-muted);
  font-size: 0.6875rem;
  text-align: right;
}

.message:hover .timestamp, .timestamp.inline {
  display: inline;
}
</style>

<div class="message {header ? 'header' : ''}">
  <div class="side">
    {#if header}
    <img class="avatar" src="{avatarurl}" />
    {:else}
    <time datetime={time.iso} class="timestamp">{time.day}</time>
    {/if}
  </div>
  <div class="content">
    {#if header}
    <span class="author">{author}</span>
    <time datetime={time.iso} class="timestamp inline">{time.human}</time>
    {/if}
    <div>{content}</div>
  </div>
</div>
