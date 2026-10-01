import type { ArtistSlug } from "./studio";

export const instagramUrls: Record<ArtistSlug, string> = {
  dadla: "https://www.instagram.com/_dadla_tatts/",
  duky: "https://www.instagram.com/dukytattooartist/",
  walla: "https://www.instagram.com/walla_tattoo/",
};
export const studioInstagram = "https://www.instagram.com/inksoul_pb/";

const offsets: Record<ArtistSlug, number[]> = {
  dadla: [3, 7, 11, 15, 20],
  duky: [4, 8, 12, 16, 22],
  walla: [5, 9, 14, 18, 24],
};

export function createSlots(artist: ArtistSlug, today = new Date()) {
  return offsets[artist].map((offset, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    return {
      id: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      day: new Intl.DateTimeFormat("sk-SK", { weekday: "short" }).format(date),
      date: String(date.getDate()).padStart(2, "0"),
      month: new Intl.DateTimeFormat("sk-SK", { month: "short" }).format(date),
      times: index % 2 ? ["10:00", "14:30"] : ["11:30", "16:00"],
    };
  });
}
