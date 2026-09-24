import styles from "../../admin.module.css";
import { getGameStats, getAdminUsers } from "@/lib/queries";
import { StarIcon, GameIcon } from "../../../wallet/icons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminGames() {
  const [m, users] = await Promise.all([getGameStats(), getAdminUsers()]);
  const maxPlays = Math.max(1, ...m.gamePlays.map((g) => g.plays));
  const playedByAccount = users
    .filter((u) => u.gamesPlayed > 0)
    .sort((a, b) => b.gamesPlayed - a.gamesPlayed);

  return (
    <>
      <div className={styles.head}>
        <h1>Games</h1>
        <p>What people are playing across all accounts.</p>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.cardIcon}>
              <StarIcon />
            </span>
            Favourite game
          </div>
          <div className={`${styles.cardVal} ${styles.accentVal}`}>
            {m.favourite?.name ?? "—"}
          </div>
          <div className={styles.cardSub}>
            {m.favourite ? `${m.favourite.plays} plays` : "No plays yet"}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.cardIcon}>
              <GameIcon />
            </span>
            Total plays
          </div>
          <div className={styles.cardVal}>{m.totalPlays}</div>
          <div className={styles.cardSub}>Across {m.gamePlays.length} games</div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelTitle}>Plays per game</div>
        {m.gamePlays.length === 0 ? (
          <div className={styles.emptyState}>No games played yet.</div>
        ) : (
          <div className={styles.bars}>
            {m.gamePlays.map((g) => (
              <div key={g.slug} className={styles.barRow}>
                <span>{g.name}</span>
                <span className={styles.barTrack}>
                  <span
                    className={styles.barFill}
                    style={{ width: `${(g.plays / maxPlays) * 100}%` }}
                  />
                </span>
                <span className={styles.barVal}>{g.plays}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelTitle}>Games played by account</div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Email</th>
                <th>Games played</th>
              </tr>
            </thead>
            <tbody>
              {playedByAccount.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.emptyState}>
                    No plays recorded yet.
                  </td>
                </tr>
              ) : (
                playedByAccount.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700 }}>{u.name}</td>
                    <td className={styles.muted}>{u.email}</td>
                    <td className={styles.mono}>{u.gamesPlayed}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
