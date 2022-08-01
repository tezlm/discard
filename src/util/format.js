function isSameDay(date1, date2) {
  return (date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear())
}

export function formatTime(d) {
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  return d.toLocaleTimeString(undefined, timeOptions);
}

export function formatDate(d, lowercase = false) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (isSameDay(d, today)) {
    return `${lowercase ? "today" : "Today"} at ${formatTime(d)}`
  }

  if (isSameDay(d, yesterday)) {
    return `${lowercase ? "yesterday" : "Yesterday"} at ${formatTime(d)}`
  }

  return d.toLocaleDateString()
}

export function formatSize(size) {
  if (!size) return "??? kb";
  let max = 1024;
  for (let unit of ["bytes", "KiB", "MiB", "GiB", "TiB"]) {
    if (size < max) return `${Math.floor(size / (max / 1024))} ${unit}`;
    max *= 1024;
  }
  return "very big";
}

export function formatDuration(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
