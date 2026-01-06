import type { Json } from "@/types";

/**
 * Downloads JSON data as a file
 * @param data - The JSON data to download
 * @param filename - The filename for the downloaded file (without extension)
 */
export function downloadJson(data: Json, filename: string): void {
  if (!data) return;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

