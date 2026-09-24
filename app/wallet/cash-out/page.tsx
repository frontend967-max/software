"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app.module.css";
import {
  DownCircleIcon,
  ShieldIcon,
  GameSolidIcon,
  CardIcon,
  BankIcon,
  ChevronIcon,
  ChevronUpIcon,
} from "../icons";

export default function CashOutPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.screen}>
      <div className={styles.pageHead}>
        <span className={styles.headRound}>
          <DownCircleIcon />
        </span>
        <h1>Cash out</h1>
        <span className={styles.headTrail}>
          <ShieldIcon />
        </span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.sectionTitle} style={{ marginTop: 22 }}>
          Where is your money?
        </h2>

        <div
          className={styles.optCard}
          onClick={() => router.push("/wallet/cash-out/move-winnings")}
        >
          <span className={styles.optIcon}>
            <GameSolidIcon />
          </span>
          <div className={styles.optBody}>
            <h3>In a game</h3>
            <p>Move game winnings back to SL Sweep.</p>
            <span className={styles.optCta}>Move game winnings</span>
          </div>
          <span className={styles.optChevron}>
            <ChevronIcon />
          </span>
        </div>

        <div
          className={styles.optCard}
          onClick={() => router.push("/wallet/cash-out/sl-balance")}
        >
          <span className={styles.optIcon}>
            <CardIcon />
          </span>
          <div className={styles.optBody}>
            <h3>In your SL balance</h3>
            <p>
              Available: $0.00. Send your SL balance to your cash-out method.
            </p>
            <span className={styles.optCta}>Cash out SL balance</span>
          </div>
          <span className={styles.optChevron}>
            <ChevronIcon />
          </span>
        </div>

        <div className={styles.subHead} onClick={() => setOpen((o) => !o)}>
          <span>Other cash-out options</span>
          {open ? <ChevronUpIcon /> : <ChevronIcon />}
        </div>

        {open && (
          <div
            className={styles.optCard}
            onClick={() => router.push("/wallet/cash-out/from-game")}
          >
            <span className={styles.optIcon}>
              <BankIcon />
            </span>
            <div className={styles.optBody}>
              <h3>Cash out game winnings</h3>
              <p>
                Send winnings directly from a game to a cash-out method. Game
                limits apply.
              </p>
              <span className={styles.optCta}>Cash out directly from a game</span>
            </div>
            <span className={styles.optChevron}>
              <ChevronIcon />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
