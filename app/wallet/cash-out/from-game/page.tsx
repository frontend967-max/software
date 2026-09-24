"use client";

import { useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import {
  GameSolidIcon,
  CashAppIcon,
  CardStackIcon,
  BankIcon,
  CheckIcon,
} from "../../icons";

const GAMES = ["CashFrenzy", "Juwa", "Firekirin", "GameVault", "Orion Stars"];
const METHODS = [
  { key: "cashapp", name: "CashApp", logo: <CashAppIcon /> },
  { key: "card", name: "Visa •••• 4242", logo: <CardStackIcon /> },
  { key: "bank", name: "Chase Bank", logo: <BankIcon /> },
];

export default function FromGamePage() {
  const [game, setGame] = useState(GAMES[0]);
  const [method, setMethod] = useState("cashapp");
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
      <InnerHeader title="Cash out from a game" fallback="/wallet/cash-out" />
      <form className={styles.body} onSubmit={submit}>
        <p className={styles.formIntro}>
          Send winnings directly from a game to your cash-out method. Per-game
          limits apply.
        </p>

        <label className={styles.fldLabel}>Game</label>
        <div className={styles.fldBox}>
          <GameSolidIcon />
          <select value={game} onChange={(e) => setGame(e.target.value)}>
            {GAMES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroupTitle} style={{ marginTop: 24 }}>
          Cash out to
        </div>
        <div className={styles.payList}>
          {METHODS.map((m) => (
            <button
              type="button"
              key={m.key}
              className={styles.payRow}
              onClick={() => setMethod(m.key)}
            >
              <span className={`${styles.radio} ${method === m.key ? styles.on : ""}`} />
              <span className={styles.payLogo}>{m.logo}</span>
              <span className={styles.payName}>{m.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.divider} />

        <label className={styles.fldLabel}>Amount</label>
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
            <span>You receive</span>
            <b>{fmt(Number(amount) || 0)}</b>
          </div>
        </div>

        <p className={styles.hint}>
          Game limits and daily cash-out caps may apply. Winnings are verified
          before payout.
        </p>

        {done && (
          <div className={styles.savedToast}>
            <CheckIcon /> Cash-out requested
          </div>
        )}
        <button className={styles.btnBlock} type="submit" disabled={!Number(amount)}>
          Cash out
        </button>
      </form>
    </div>
  );
}
