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

export function formatDate(d) {
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

export function formatSize(size) {
  if (!size) return "??? kb";
  let max = 1024;
  for (let unit of ["bytes", "KiB", "MiB", "GiB", "TiB"]) {
    if (size < max) return `${Math.floor(size / (max / 1024))} ${unit}`;
    max *= 1024;
  }
  return "very big";
}
