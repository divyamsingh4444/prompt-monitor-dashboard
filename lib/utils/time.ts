export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "JUST_NOW"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}M_AGO`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}H_AGO`
  const days = Math.floor(hours / 24)
  return `${days}D_AGO`
}

export function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
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
    .replace(",", "")
}
