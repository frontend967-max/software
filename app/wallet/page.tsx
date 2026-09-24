"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./app.module.css";
import { getSession } from "./auth";
import {
  CalendarIcon,
  BellIcon,
  EyeIcon,
  PlusIcon,
  GameIcon,
  TagIcon,
  GiftIcon,
  ReceiptIcon,
  ChevronIcon,
} from "./icons";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("there");

  useEffect(() => {
    const sess = getSession();
    if (sess?.name) setName(sess.name.split(" ")[0]);
  }, []);

  const quickActions = [
    { key: "game", label: "Add money to a game", icon: <GameIcon />, go: "/wallet/games" },
    { key: "promo", label: "Enter promo code", icon: <TagIcon />, go: "/wallet/account/promo-codes" },
    { key: "invite", label: "Invite friends", icon: <GiftIcon />, go: "/wallet/account/invite-friends" },
  ];

  return (
    <div className={styles.screen}>
      <div className={styles.topbar}>
        <div className={styles.logo}>
          <b>$L</b>
          <span>sweep</span>
        </div>
        <div className={styles.iconRow}>
          <button className={styles.iconBtn} aria-label="Calendar">
            <CalendarIcon />
          </button>
          <button className={styles.iconBtn} aria-label="Notifications">
            <BellIcon />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <h1 className={styles.hi}>Hi, {name}</h1>

        <div className={styles.deskGrid}>
          <div className={`${styles.deskCard} ${styles.balanceCard}`}>
            <div className={styles.balLabelRow}>
              <span className={styles.balLabel}>SL Sweep balance</span>
              <span className={styles.eye} aria-label="Toggle balance">
                <EyeIcon />
              </span>
            </div>
            <div className={styles.balance}>$0.00</div>

            <div className={styles.actions}>
              <button
                className={styles.btnPrimary}
                onClick={() => router.push("/wallet/add-funds")}
              >
                <PlusIcon /> Add funds
              </button>
              <button
                className={styles.btnOutline}
                onClick={() => router.push("/wallet/cash-out")}
              >
                Cash out
              </button>
            </div>
          </div>

          <div className={styles.deskCard}>
            <h2 className={styles.sectionTitle}>What would you like to do?</h2>
            <div className={styles.list}>
              {quickActions.map((a) => (
                <button
                  key={a.key}
                  className={styles.listItem}
                  onClick={() => router.push(a.go)}
                >
                  <span className={styles.listIcon}>{a.icon}</span>
                  <span className={styles.listLabel}>{a.label}</span>
                  <span className={styles.chevron}>
                    <ChevronIcon />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>
          Recent activity
        </h2>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <ReceiptIcon />
          </div>
          <div className={styles.emptyTitle}>No recent transactions</div>
          <p className={styles.emptyText}>
            Your add-funds, game-load, and cash-out activity will appear here.
          </p>
          <button
            className={styles.btnBlock}
            onClick={() => router.push("/wallet/add-funds")}
          >
            Add funds
          </button>
        </div>
      </div>
    </div>
  );
}
