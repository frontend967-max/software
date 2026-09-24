"use client";

import { useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { GameSolidIcon, CheckIcon } from "../../icons";

const GAMES = [
  { name: "CashFrenzy", balance: 0 },
  { name: "Juwa", balance: 0 },
  { name: "Firekirin", balance: 0 },
  { name: "GameVault", balance: 0 },
];

export default function MoveWinningsPage() {
  const [game, setGame] = useState(GAMES[0].name);
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className={styles.screen}>
      <InnerHeader title="Move game winnings" fallback="/wallet/cash-out" />
      <form className={styles.body} onSubmit={submit}>
        <p className={styles.formIntro}>
          Move winnings from a game back to your GameHub balance. From there you
          can cash out to any method.
        </p>

        <div className={styles.formGroupTitle}>Select a game</div>
        <div className={styles.payList}>
          {GAMES.map((g) => (
            <button
              type="button"
              key={g.name}
              className={styles.payRow}
              onClick={() => setGame(g.name)}
            >
              <span className={`${styles.radio} ${game === g.name ? styles.on : ""}`} />
              <span className={styles.payLogo}>
                <GameSolidIcon />
              </span>
              <span style={{ flex: 1 }}>
                <span className={styles.payName}>{g.name}</span>
                <div className={styles.methodSub}>Winnings: {fmt(g.balance)}</div>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.divider} />

        <label className={styles.fldLabel}>Amount to move</label>
        <div className={styles.fldBox}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#0b0b0c" }}>$</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setDone(false);
            }}
            placeholder="0.00"
          />
        </div>

        <div className={styles.summary} style={{ marginTop: 22 }}>
          <div className={`${styles.sumRow} ${styles.top}`}>
            <span>From {game}</span>
            <b>{fmt(Number(amount) || 0)}</b>
          </div>
          <div className={`${styles.sumRow} ${styles.strong}`}>
            <span>GameHub balance receives</span>
            <b>{fmt(Number(amount) || 0)}</b>
          </div>
        </div>

        {done && (
          <div className={styles.savedToast}>
            <CheckIcon /> Winnings moved to your GameHub balance
          </div>
        )}
        <button className={styles.btnBlock} type="submit" disabled={!Number(amount)}>
          Move to GameHub balance
        </button>
      </form>
    </div>
  );
}
