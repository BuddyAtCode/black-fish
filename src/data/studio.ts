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
    descriptor: "Snové motívy / príroda / jemný detail",
    statement: "Príroda, fantázia a emócia zachytené na koži.",
    intro:
      "V Dadlinom rukopise sa prelínajú ženské portréty, zvieratá a botanické detaily. Jemná kresba drží obraz pokope, farba mu dáva náladu.",
    paragraphs: [
      "Motív rastie z nálady, príbehu a miesta na tele. Dadla pracuje citlivo s mierkou, aby aj drobná kresba pôsobila premyslene a väčšia kompozícia mala vzduch.",
      "Jej obrazy spájajú mäkké prechody, presnú linku a drobné prekvapenia. Výsledok pôsobí osobne, ľahko a zostáva čitateľný v každom detaile.",
    ],
    details: ["Snové motívy", "Portrét a príroda", "Jemný detail"],
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
    descriptor: "Dynamika / svetlo / napätie",
    statement: "Dravý realizmus plný pohybu, svetla a napätia.",
    intro:
      "Duky zachytáva okamih tesne pred pohybom. Šelmy, portréty a temné symboly skladá do scén s ostrým svetlom, hlbokým tieňom a sýtymi farbami.",
    paragraphs: [
      "Kompozíciu stavia tak, aby mala silu už z diaľky. Zblízka sa otvárajú textúry, odlesky a precízne prechody, ktoré obrazu dávajú hĺbku.",
      "Každý návrh prispôsobuje pohybu tela a prirodzenej línii svalov. Výsledok je intenzívny, technicky čistý a nabitý energiou.",
    ],
    details: ["Dynamický realizmus", "Zvieratá a portréty", "Svetlo a kontrast"],
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
    descriptor: "Fantasy svety / postavy / atmosféra",
    statement: "Postavy a svety, ktoré na koži pokračujú vlastným príbehom.",
    intro:
      "Walla otvára na koži svety fantasy, anime a temnej rozprávky. Každá postava dostáva vlastný výraz, atmosféru a príbeh.",
    paragraphs: [
      "Inšpiráciou môže byť obľúbená postava, herný svet alebo vlastná predstava. Walla z nej vytvorí scénu, ktorá rešpektuje tvar tela a zachováva emóciu predlohy.",
      "Sýte farby, mäkké tiene a čisté kontúry držia motív čitateľný. Výraz tváre, gesto a drobný detail dávajú každej postave vlastnú osobnosť.",
    ],
    details: ["Fantasy svety", "Anime postavy", "Farebná atmosféra"],
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
