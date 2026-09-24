"use client";

import { useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { CashAppIcon, CardStackIcon, BankIcon, CheckIcon } from "../../icons";

const METHODS = [
  { key: "cashapp", name: "CashApp", sub: "$lingchen", logo: <CashAppIcon /> },
  { key: "card", name: "Visa •••• 4242", sub: "Instant", logo: <CardStackIcon /> },
  { key: "bank", name: "Chase Bank", sub: "1–3 business days", logo: <BankIcon /> },
];

export default function SLBalancePage() {
  const available = 0;
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
      <InnerHeader title="Cash out SL balance" fallback="/wallet/cash-out" />
      <form className={styles.body} onSubmit={submit}>
        <p className={styles.formIntro}>
          Send money from your SL Sweep balance to your cash-out method.
        </p>

        <div className={styles.summary} style={{ marginBottom: 26 }}>
          <div className={`${styles.sumRow} ${styles.strong}`}>
            <span>Available balance</span>
            <b>{fmt(available)}</b>
          </div>
        </div>

        <div className={styles.formGroupTitle}>Cash out to</div>
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
              <span style={{ flex: 1 }}>
                <span className={styles.payName}>{m.name}</span>
                <div className={styles.methodSub}>{m.sub}</div>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.divider} />

        <label className={styles.fldLabel}>Amount to cash out</label>
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
        <p className={styles.hint}>Minimum cash-out is $10.00. No fees on CashApp.</p>

        {done && (
          <div className={styles.savedToast}>
            <CheckIcon /> Cash-out requested
          </div>
        )}
        <button className={styles.btnBlock} type="submit" disabled={!Number(amount)}>
          Cash out {amount ? fmt(Number(amount)) : ""}
        </button>
      </form>
    </div>
  );
}
