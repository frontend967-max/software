import styles from "../admin.module.css";
import { getAdminOverview } from "@/lib/queries";
import {
  UsersIcon,
  WalletIcon,
  TrendUpIcon,
  TrendDownIcon,
  StarIcon,
  ReceiptIcon,
  GameIcon,
  CardIcon,
  BankIcon,
} from "../../wallet/icons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const money2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const pillClass = (s: string) =>
  s === "APPROVED"
    ? styles.pillApproved
    : s === "DECLINED"
      ? styles.pillDeclined
      : styles.pillPending;

export default async function AdminOverview() {
  const d = await getAdminOverview();
  const maxPlays = Math.max(1, ...d.gamePlays.map((g) => g.plays));
  const maxTrend = Math.max(1, ...d.trend.map((t) => t.amount));
  const maxMethod = Math.max(1, ...d.methodBreakdown.map((m) => m.amount));

  const cards = [
    { label: "Total users", value: String(d.totalUsers), icon: <UsersIcon />, sub: `+${d.newUsers7d} this week` },
    { label: "Total balance held", value: money(d.totalBalance), icon: <WalletIcon />, cls: styles.accentVal, sub: "Money in − money out" },
    { label: "Total in", value: money(d.totalIn), icon: <TrendUpIcon />, cls: styles.okVal, sub: `${d.depositCount} approved deposits` },
    { label: "Total out", value: money(d.totalOut), icon: <TrendDownIcon />, sub: `${d.payoutCount} approved payouts` },
    { label: "Pending requests", value: String(d.pendingCount), icon: <ReceiptIcon />, cls: styles.accentVal, sub: `${money(d.pendingAmount)} awaiting` },
    { label: "Avg deposit", value: money2(d.avgDeposit), icon: <CardIcon />, sub: "Per approved deposit" },
    { label: "Biggest deposit", value: d.biggestDeposit ? money(d.biggestDeposit.amount) : "—", icon: <BankIcon />, cls: styles.okVal, sub: d.biggestDeposit ? `by ${d.biggestDeposit.name}` : "No deposits yet" },
    { label: "Active players", value: String(d.activePlayers), icon: <GameIcon />, sub: `${d.totalPlays} total plays` },
    { label: "Favourite game", value: d.favourite?.name ?? "—", icon: <StarIcon />, cls: styles.accentVal, sub: d.favourite ? `${d.favourite.plays} plays` : "No plays yet" },
  ];

  return (
    <>
      <div className={styles.head}>
        <h1>Overview</h1>
        <p>Live snapshot across all GameHub accounts.</p>
      </div>

      <div className={styles.cards}>
        {cards.map((c) => (
          <div key={c.label} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.cardIcon}>{c.icon}</span>
              {c.label}
            </div>
            <div className={`${styles.cardVal} ${c.cls ?? ""}`}>{c.value}</div>
            <div className={styles.cardSub}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelTitle}>
          Deposits — last 14 days
          <span className={styles.badge}>{money(d.totalIn)} all time</span>
        </div>
        <div className={styles.trend}>
          {d.trend.map((t, i) => (
            <div key={i} className={styles.trendCol}>
              <span
                className={styles.trendBar}
                style={{ height: `${(t.amount / maxTrend) * 100}%` }}
                title={`${t.day}: ${money(t.amount)}`}
              />
              <span className={styles.trendLabel}>{t.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Deposit methods</div>
          {d.methodBreakdown.length === 0 ? (
            <div className={styles.emptyState}>No deposits yet.</div>
          ) : (
            <div className={styles.bars}>
              {d.methodBreakdown.map((m) => (
                <div key={m.method} className={styles.barRow}>
                  <span>
                    {m.method}
                    <span className={styles.muted}> · {m.count}</span>
                  </span>
                  <span className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{ width: `${(m.amount / maxMethod) * 100}%` }}
                    />
                  </span>
                  <span className={styles.barVal}>{money(m.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            Games played
            <span className={styles.badge}>{d.totalPlays} total</span>
          </div>
          {d.gamePlays.length === 0 ? (
            <div className={styles.emptyState}>No games played yet.</div>
          ) : (
            <div className={styles.bars}>
              {d.gamePlays.slice(0, 6).map((g) => (
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
      </div>

      <div className={styles.grid2}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Top players by balance</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {d.topPlayers.map((p) => (
                  <tr key={p.email}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div className={styles.muted} style={{ fontSize: 12 }}>
                        {p.email}
                      </div>
                    </td>
                    <td className={`${styles.mono} ${styles.accentVal}`}>
                      {money2(p.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>Recent activity</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {d.recent.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700 }}>{t.userName}</td>
                    <td className={styles.muted}>
                      {t.kind === "DEPOSIT" ? "Deposit" : "Payout"}
                    </td>
                    <td className={styles.mono}>{money2(t.amount)}</td>
                    <td>
                      <span className={`${styles.pill} ${pillClass(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
