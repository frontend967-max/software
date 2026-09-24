"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app.module.css";
import { GameSolidIcon, SearchIcon, StarIcon } from "../icons";
import { GAMES, monogram } from "./data";

const FILTERS = [
  { key: "all", label: "All games" },
  { key: "hot", label: "🔥 Playing hot" },
  { key: "fav", label: "Favorites" },
];

export default function GamesPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "hot" | "fav">("all");
  const [favs, setFavs] = useState<Record<string, boolean>>({ cashfrenzy: true });

  const toggleFav = (slug: string) =>
    setFavs((f) => ({ ...f, [slug]: !f[slug] }));

  const shown = useMemo(() => {
    return GAMES.filter((g) => {
      if (q && !g.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === "hot" && !g.hot) return false;
      if (filter === "fav" && !favs[g.slug]) return false;
      return true;
    });
  }, [q, filter, favs]);

  const reset = () => {
    setQ("");
    setFilter("all");
  };

  return (
    <div className={styles.screen}>
      <div className={styles.pageHead}>
        <h1>Game floor</h1>
        <span className={styles.headTrail} style={{ color: "#0b0b0c" }}>
          <GameSolidIcon />
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.search}>
          <SearchIcon />
          <input
            placeholder="Search games..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.chipBtn} ${filter === f.key ? styles.on : ""}`}
              onClick={() => setFilter(f.key as typeof filter)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.gamesGrid}>
          {shown.length === 0 ? (
            <div className={styles.gamesEmpty}>
              <div className={styles.emoji}>🎰</div>
              <div className={styles.gamesEmptyTitle}>Oops, nothing here</div>
              <p className={styles.gamesEmptyText}>
                {filter === "fav"
                  ? "You haven't starred any games yet. Tap the star on a game to add it here."
                  : "No games match your search. Try a different name or clear your filters."}
              </p>
              <button className={styles.btnBlock} style={{ maxWidth: 220 }} onClick={reset}>
                Clear filters
              </button>
            </div>
          ) : (
            shown.map((g) => (
              <div
                key={g.slug}
                className={styles.gcard}
                onClick={() => router.push(`/wallet/games/${g.slug}`)}
              >
                <div className={styles.gThumbWrap}>
                  <div className={styles.gThumb} style={{ background: g.bg }}>
                    {monogram(g.name)}
                  </div>
                  {g.hot && <span className={styles.hotBadge}>🔥 Hot</span>}
                  <span
                    className={`${styles.gStar} ${favs[g.slug] ? styles.fav : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(g.slug);
                    }}
                  >
                    <StarIcon filled={favs[g.slug]} />
                  </span>
                </div>
                <div className={styles.gName}>{g.name}</div>
                <div className={styles.gMeta}>
                  <span>{g.genre}</span>
                  <span className={styles.dotSep} />
                  <span>
                    <span className={styles.star}>★</span> {g.rating}
                  </span>
                </div>
                <span className={`${styles.gStatus} ${g.ready ? styles.ready : ""}`}>
                  <span className={styles.gDot} />
                  {g.ready ? "Ready to play" : "Not set up"}
                </span>
                <button className={styles.gSetup}>
                  {g.ready ? "Play now" : "Set up game"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
