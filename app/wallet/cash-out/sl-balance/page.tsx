"use client";

import { useEffect, useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { CashAppIcon, CardStackIcon, BankIcon, CheckIcon } from "../../icons";

const METHODS = [
  { key: "cashapp", name: "CashApp", sub: "Instant", logo: <CashAppIcon />, method: "OTHER" },
  { key: "card", name: "Card", sub: "Instant", logo: <CardStackIcon />, method: "CARD" },
  { key: "bank", name: "Bank transfer", sub: "1–3 business days", logo: <BankIcon />, method: "OTHER" },
];

export default function SLBalancePage() {
  const [available, setAvailable] = useState(0);
  const [method, setMethod] = useState("cashapp");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/wallet", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAvailable(typeof d.balance === "number" ? d.balance : 0))
      .catch(() => setAvailable(0));
  }, []);

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value) return;
    if (value < 10) {
      setErr("Minimum cash-out is $10.00.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/wallet/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "PAYOUT",
          method: METHODS.find((m) => m.key === method)?.method ?? "OTHER",
          amount: value,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Could not submit request.");
        setBusy(false);
        return;
      }
      setDone(true);
    } catch {
      setErr("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className={styles.screen}>
      <InnerHeader title="Cash out balance" fallback="/wallet/cash-out" />
      <form className={styles.body} onSubmit={submit}>
        <p className={styles.formIntro}>
          Request a payout from your GameHub balance to your cash-out method.
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
          <span className={styles.fldPrefix}>$</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setDone(false);
              setErr("");
            }}
            placeholder="0.00"
          />
        </div>
        <p className={styles.hint}>Minimum cash-out is $10.00.</p>

        {err && <div className={styles.authErr}>{err}</div>}
        {done && (
          <div className={styles.savedToast}>
            <CheckIcon /> Cash-out requested — pending approval
          </div>
        )}
        <button
          className={styles.btnBlock}
          type="submit"
          disabled={!Number(amount) || busy || done}
        >
          {busy ? "Submitting…" : `Cash out ${amount ? fmt(Number(amount)) : ""}`}
        </button>
      </form>
    </div>
  );
}
