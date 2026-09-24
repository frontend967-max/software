"use client";

import { useState } from "react";
import styles from "../app.module.css";
import { CashAppIcon, CardStackIcon } from "../icons";

const AMOUNTS = [9.99, 14.99, 19.99, 29.99, 39.99, 49.99, 99.99, 199.99];

export default function AddFundsPage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [method, setMethod] = useState<"cashapp" | "card">("cashapp");

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className={styles.screen}>
      <div className={styles.pageHead}>
        <h1>Add funds</h1>
      </div>

      <div className={styles.body}>
        <p className={styles.lead}>Add money to your SL Sweep balance.</p>

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
                <span>SL balance receives</span>
                <b>{fmt(amount ?? 0)}</b>
              </div>
            </div>

            <button className={styles.btnBlock} disabled={!amount}>
              Continue to payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
