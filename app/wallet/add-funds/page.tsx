"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app.module.css";
import { CashAppIcon, CardStackIcon, CheckIcon } from "../icons";

const AMOUNTS = [9.99, 14.99, 19.99, 29.99, 39.99, 49.99, 99.99, 199.99];

// UI option -> Transaction.method enum
const METHOD_MAP: Record<string, string> = { cashapp: "OTHER", card: "CARD" };

export default function AddFundsPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number | null>(null);
  const [method, setMethod] = useState<"cashapp" | "card">("cashapp");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const submit = async () => {
    if (!amount) return;
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/wallet/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "DEPOSIT",
          method: METHOD_MAP[method],
          amount,
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

  if (done) {
    return (
      <div className={styles.screen}>
        <div className={styles.pageHead}>
          <h1>Add funds</h1>
        </div>
        <div className={styles.body}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <CheckIcon />
            </div>
            <div className={styles.emptyTitle}>Request submitted</div>
            <p className={styles.emptyText}>
              Your {fmt(amount ?? 0)} deposit request is pending review. Your
              balance updates once it&apos;s approved.
            </p>
            <button
              className={styles.btnBlock}
              onClick={() => router.push("/wallet")}
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.pageHead}>
        <h1>Add funds</h1>
      </div>

      <div className={styles.body}>
        <p className={styles.lead}>Add money to your GameHub balance.</p>

        <div className={styles.deskGrid}>
          <div>
            <h2 className={styles.sectionTitle}>Amount</h2>
            <div className={styles.amtGrid}>
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  className={`${styles.amtBtn} ${amount === a ? styles.on : ""}`}
                  onClick={() => setAmount(a)}
                >
                  {fmt(a)}
                </button>
              ))}
            </div>
            <p className={styles.hint}>This payment option uses fixed amounts.</p>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Pay with</h2>
            <div className={styles.payList}>
              <button
                className={styles.payRow}
                onClick={() => setMethod("cashapp")}
              >
                <span className={`${styles.radio} ${method === "cashapp" ? styles.on : ""}`} />
                <span className={styles.payLogo}>
                  <CashAppIcon />
                </span>
                <span className={styles.payName}>CashApp</span>
              </button>
              <button className={styles.payRow} onClick={() => setMethod("card")}>
                <span className={`${styles.radio} ${method === "card" ? styles.on : ""}`} />
                <span className={styles.payLogo}>
                  <CardStackIcon />
                </span>
                <span className={styles.payName}>Card</span>
              </button>
            </div>

            <div className={styles.summary}>
              <div className={`${styles.sumRow} ${styles.top}`}>
                <span>You add</span>
                <b>{fmt(amount ?? 0)}</b>
              </div>
              <div className={`${styles.sumRow} ${styles.strong}`}>
                <span>Balance receives</span>
                <b>{fmt(amount ?? 0)}</b>
              </div>
            </div>

            {err && <div className={styles.authErr}>{err}</div>}

            <button
              className={styles.btnBlock}
              disabled={!amount || busy}
              onClick={submit}
            >
              {busy ? "Submitting…" : "Submit deposit request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
