export type Game = {
  slug: string;
  name: string;
  bg: string;
  genre: string;
  rating: number;
  players: string;
  hot?: boolean;
  ready?: boolean;
};

export const GAMES: Game[] = [
  { slug: "cashfrenzy", name: "CashFrenzy", bg: "linear-gradient(150deg,#f5a623,#b5121f)", genre: "Slots", rating: 4.8, players: "12.4k", hot: true, ready: true },
  { slug: "firekirin", name: "Firekirin", bg: "linear-gradient(150deg,#0a1f14,#1c3a24)", genre: "Fish", rating: 4.7, players: "9.8k", hot: true },
  { slug: "gamevault", name: "GameVault", bg: "linear-gradient(150deg,#8a44f0,#3aa0ff)", genre: "Slots", rating: 4.6, players: "7.1k" },
  { slug: "juwa", name: "Juwa", bg: "linear-gradient(150deg,#c0182f,#5a1fb0)", genre: "Fish", rating: 4.9, players: "15.2k", hot: true },
  { slug: "juwa-2", name: "Juwa 2", bg: "linear-gradient(150deg,#111,#3a3a3a)", genre: "Fish", rating: 4.5, players: "5.4k" },
  { slug: "lasvegas-sweeps", name: "LasVegas Sweeps", bg: "linear-gradient(150deg,#e94db2,#7b2ff7)", genre: "Slots", rating: 4.4, players: "6.0k" },
  { slug: "orion-stars", name: "Orion Stars", bg: "linear-gradient(150deg,#178a4a,#0e6b4d)", genre: "Arcade", rating: 4.7, players: "8.9k", hot: true },
  { slug: "milky-way", name: "Milky Way", bg: "linear-gradient(150deg,#22b8cf,#0e6b7d)", genre: "Arcade", rating: 4.3, players: "4.2k" },
];

export const monogram = (name: string) => {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, "").trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);
