export function formatPrice(value) {
  return typeof value === "number" ? `$${value.toFixed(2)}` : "--";
}

export function formatPercent(value) {
  return typeof value === "number" ? `${value.toFixed(2)}%` : "--";
}

export function formatTime(timestamp) {
  if (!timestamp) return "--";
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatNewsTime(unixSeconds) {
  if (!unixSeconds) return "--";
  return new Date(unixSeconds * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
