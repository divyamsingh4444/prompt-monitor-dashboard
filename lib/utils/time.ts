export function formatTimeAgo(dateInput: string | number): string {
  const date =
    typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "JUST_NOW";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M_AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H_AGO`;
  const days = Math.floor(hours / 24);
  return `${days}D_AGO`;
}

export function formatTimestamp(dateInput: string | number): string {
  const date =
    typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);
  return date
    .toLocaleString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replace(",", "");
}
