function isSameDay(date1: Date, date2: Date) {
  return (date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear());
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined,  {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(date: Date, lowercase = false) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) {
    return `${lowercase ? "today" : "Today"} at ${formatTime(date)}`;
  }

  if (isSameDay(date, yesterday)) {
    return `${lowercase ? "yesterday" : "Yesterday"} at ${formatTime(date)}`;
  }

  return date.toLocaleDateString();
}

export function formatSize(size: number): string {
  if (size === 0) return "0 kb";
  let max = 1024;
  for (let unit of ["bytes", "KiB", "MiB", "GiB", "TiB"]) {
    if (size < max) return `${Math.floor(size / (max / 102400)) / 100} ${unit}`;
    max *= 1024;
  }
  return "very big";
}

export function formatDuration(duration: number) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
