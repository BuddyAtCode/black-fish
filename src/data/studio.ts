export type ArtistSlug = "dadla" | "duky" | "walla";

export type Artist = {
  slug: ArtistSlug;
  name: string;
  number: string;
  accent: string;
  image: string;
  imagePosition: string;
  descriptor: string;
  statement: string;
  intro: string;
  paragraphs: [string, string];
  details: string[];
  gallery: Array<{
    src: string;
    position: string;
  }>;
};

export type StudioWork = {
  src: string;
  title: string;
  artist: ArtistSlug;
  number: string;
  size: "is-wide" | "is-tall" | "is-small" | "is-medium";
  position: string;
};

export const artists: Artist[] = [
  {
    slug: "dadla",
    name: "DADLA",
    number: "01",
    accent: "#d31625",
    image: "/images/generated/tattoo-botanical-eye.webp",
    imagePosition: "50% 48%",
    descriptor: "Jemná kresba / organické tvary / detail",
    statement: "Kompozície, ktoré prirodzene kopírujú pohyb tela.",
    intro:
      "Dadla pracuje s presnou linkou, prírodnými detailmi a obrazmi, ktoré sa rozvíjajú podľa miesta na tele.",
    paragraphs: [
      "Návrh začína rozhovorom a kresbou. Dadla hľadá tvar, mierku a rytmus, ktoré budú fungovať na konkrétnom tele.",
      "Výsledok pôsobí citlivo aj výrazne. Dôležitá je čistá kresba, detail a priestor, ktorý motív nechá dýchať.",
    ],
    details: ["Autorské návrhy", "Jemná linka", "Organické kompozície"],
    gallery: [
      { src: "/images/generated/tattoo-botanical-eye.webp", position: "50% 48%" },
      { src: "/images/generated/tattoo-session.jpg", position: "32% 55%" },
      { src: "/images/generated/tattoo-abstract-forearm.webp", position: "70% 50%" },
    ],
  },
  {
    slug: "duky",
    name: "DUKY",
    number: "02",
    accent: "#d31625",
    image: "/images/generated/tattoo-session.jpg",
    imagePosition: "42% 52%",
    descriptor: "Kontrast / tieň / silueta",
    statement: "Silné tetovania postavené na svetle, hĺbke a tvare.",
    intro:
      "Duky stavia návrhy na kontraste a jasnej siluete. Veľké plochy prepája s mäkkým tieňom a presným detailom.",
    paragraphs: [
      "Každý motív skladá podľa vzdialenosti, z ktorej má fungovať, aj podľa detailu, ktorý človek objaví až zblízka.",
      "Pri konzultácii sa rieši umiestnenie, čitateľnosť a to, ako sa kompozícia zmení pri pohybe tela.",
    ],
    details: ["Výrazný kontrast", "Mäkké tieňovanie", "Väčšie kompozície"],
    gallery: [
      { src: "/images/generated/tattoo-session.jpg", position: "42% 52%" },
      { src: "/images/generated/tattoo-abstract-forearm.webp", position: "64% 48%" },
      { src: "/images/generated/tattoo-botanical-eye.webp", position: "50% 55%" },
    ],
  },
  {
    slug: "walla",
    name: "WALLA",
    number: "03",
    accent: "#d31625",
    image: "/images/generated/tattoo-abstract-forearm.webp",
    imagePosition: "68% 50%",
    descriptor: "Grafický tvar / sýty akcent / rytmus",
    statement: "Motívy, ktoré držia z diaľky a odmeňujú detailom.",
    intro:
      "Walla pracuje s grafickým tvarom, výrazným akcentom a voľným priestorom. Návrh skladá tak, aby na tele pôsobil ľahko a sebavedomo.",
    paragraphs: [
      "Inšpirácia môže prísť zo symbolu, fotografie alebo jednej farby. Walla ju premení na čistú a dobre čitateľnú kompozíciu.",
      "Dôležitý je rytmus motívu, správna mierka a detail, ktorý zostane presný aj po zahojení.",
    ],
    details: ["Grafické motívy", "Farebný akcent", "Čistá kompozícia"],
    gallery: [
      { src: "/images/generated/tattoo-abstract-forearm.webp", position: "68% 50%" },
      { src: "/images/generated/tattoo-botanical-eye.webp", position: "48% 50%" },
      { src: "/images/generated/tattoo-session.jpg", position: "58% 54%" },
    ],
  },
];

export const studioWorks: StudioWork[] = [
  {
    src: "/images/generated/tattoo-botanical-eye.webp",
    title: "Botanická línia",
    artist: "dadla",
    number: "001",
    size: "is-tall",
    position: "50% 48%",
  },
  {
    src: "/images/generated/tattoo-session.jpg",
    title: "Tichý kontrast",
    artist: "duky",
    number: "002",
    size: "is-wide",
    position: "42% 54%",
  },
  {
    src: "/images/generated/tattoo-abstract-forearm.webp",
    title: "Grafický pohyb",
    artist: "walla",
    number: "003",
    size: "is-small",
    position: "72% 50%",
  },
  {
    src: "/images/generated/tattoo-botanical-eye.webp",
    title: "Detail v pohybe",
    artist: "dadla",
    number: "004",
    size: "is-medium",
    position: "38% 52%",
  },
  {
    src: "/images/generated/tattoo-session.jpg",
    title: "Svetlo a tieň",
    artist: "duky",
    number: "005",
    size: "is-tall",
    position: "60% 48%",
  },
  {
    src: "/images/generated/tattoo-abstract-forearm.webp",
    title: "Voľná línia",
    artist: "walla",
    number: "006",
    size: "is-wide",
    position: "58% 48%",
  },
  {
    src: "/images/generated/tattoo-botanical-eye.webp",
    title: "Organický detail",
    artist: "dadla",
    number: "007",
    size: "is-small",
    position: "64% 50%",
  },
  {
    src: "/images/generated/tattoo-session.jpg",
    title: "Hĺbka",
    artist: "duky",
    number: "008",
    size: "is-medium",
    position: "28% 56%",
  },
  {
    src: "/images/generated/tattoo-abstract-forearm.webp",
    title: "Červený bod",
    artist: "walla",
    number: "009",
    size: "is-tall",
    position: "78% 52%",
  },
];

export function getArtist(slug?: string) {
  return artists.find((artist) => artist.slug === slug);
}
