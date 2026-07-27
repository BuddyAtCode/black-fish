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
    image: "/images/artists/dadla-hero.webp",
    imagePosition: "50% 48%",
    descriptor: "Farebný realizmus / jemná kresba / detail",
    statement: "Od jemného detailu po sýte farebné kompozície.",
    intro:
      "Dadla spája presnú kresbu s výraznou farbou a mäkkým tieňovaním. Každý motív prispôsobuje miestu a pohybu tela.",
    paragraphs: [
      "Návrh začína rozhovorom a kresbou. Dadla hľadá tvar, mierku a farebnosť, ktoré budú fungovať na konkrétnom tele.",
      "V práci necháva vyniknúť čistý detail, mäkké prechody a výraznú kompozíciu, ktorá zostáva čitateľná aj z diaľky.",
    ],
    details: ["Autorské návrhy", "Farebný realizmus", "Jemný detail"],
    gallery: [
      { src: "/images/artists/dadla-blackgrey.webp", position: "50% 50%" },
      { src: "/images/artists/dadla-bird.webp", position: "50% 48%" },
      { src: "/images/artists/dadla-wolf.webp", position: "50% 48%" },
    ],
  },
  {
    slug: "duky",
    name: "DUKY",
    number: "02",
    accent: "#d31625",
    image: "/images/artists/duky-hero.webp",
    imagePosition: "50% 50%",
    descriptor: "Realizmus / sýta farba / kontrast",
    statement: "Realistické kompozície s filmovým svetlom a výraznou farbou.",
    intro:
      "Duky stavia realistické motívy na svetle, hĺbke a sýtej farbe. Veľké plochy prepája s čistým detailom a výraznou siluetou.",
    paragraphs: [
      "Každý motív skladá podľa vzdialenosti, z ktorej má fungovať, aj podľa detailu, ktorý človek objaví až zblízka.",
      "Pri konzultácii rieši umiestnenie, čitateľnosť a to, ako farba aj kontrast fungujú pri pohybe tela.",
    ],
    details: ["Realistické motívy", "Farebné kompozície", "Väčšie plochy"],
    gallery: [
      { src: "/images/artists/duky-cat.webp", position: "50% 48%" },
      { src: "/images/artists/duky-geometric.webp", position: "50% 48%" },
      { src: "/images/artists/duky-blue.webp", position: "50% 48%" },
    ],
  },
  {
    slug: "walla",
    name: "WALLA",
    number: "03",
    accent: "#d31625",
    image: "/images/artists/walla-hero.webp",
    imagePosition: "50% 42%",
    descriptor: "Anime / fantasy / farebný detail",
    statement: "Postavy a svety postavené na príbehu, farbe a charaktere.",
    intro:
      "Walla premieňa anime, fantasy a vlastné postavy na výrazné tetovania. Farbu, výraz a detail skladá podľa konkrétneho miesta na tele.",
    paragraphs: [
      "Návrh môže vychádzať z obľúbenej postavy, príbehu alebo vlastnej predstavy. Walla mu dá osobitý výraz a farebnú atmosféru.",
      "Dôležitá je správna mierka, čitateľná silueta a detail, ktorý si motív zachová aj po zahojení.",
    ],
    details: ["Anime a fantasy", "Farebné motívy", "Temné portréty"],
    gallery: [
      { src: "/images/artists/walla-fantasy.webp", position: "50% 48%" },
      { src: "/images/artists/walla-anime.webp", position: "50% 48%" },
      { src: "/images/artists/walla-blackgrey.webp", position: "50% 48%" },
    ],
  },
];

export const studioWorks: StudioWork[] = [
  {
    src: "/images/artists/dadla-hero.webp",
    title: "Pineapple Girl",
    artist: "dadla",
    number: "001",
    size: "is-tall",
    position: "50% 50%",
  },
  {
    src: "/images/artists/duky-hero.webp",
    title: "Farebný realizmus",
    artist: "duky",
    number: "002",
    size: "is-wide",
    position: "50% 50%",
  },
  {
    src: "/images/artists/walla-fantasy.webp",
    title: "Fantasy portrét",
    artist: "walla",
    number: "003",
    size: "is-small",
    position: "50% 48%",
  },
  {
    src: "/images/artists/dadla-blackgrey.webp",
    title: "Egyptský tieň",
    artist: "dadla",
    number: "004",
    size: "is-medium",
    position: "50% 50%",
  },
  {
    src: "/images/artists/duky-cat.webp",
    title: "Šelma v pohybe",
    artist: "duky",
    number: "005",
    size: "is-tall",
    position: "50% 48%",
  },
  {
    src: "/images/artists/walla-anime.webp",
    title: "Anime energia",
    artist: "walla",
    number: "006",
    size: "is-wide",
    position: "50% 48%",
  },
  {
    src: "/images/artists/dadla-bird.webp",
    title: "Zlatý vták",
    artist: "dadla",
    number: "007",
    size: "is-small",
    position: "50% 48%",
  },
  {
    src: "/images/artists/duky-geometric.webp",
    title: "Geometrický portrét",
    artist: "duky",
    number: "008",
    size: "is-medium",
    position: "50% 48%",
  },
  {
    src: "/images/artists/walla-blackgrey.webp",
    title: "Black & Grey portrét",
    artist: "walla",
    number: "009",
    size: "is-tall",
    position: "50% 48%",
  },
];

export function getArtist(slug?: string) {
  return artists.find((artist) => artist.slug === slug);
}
