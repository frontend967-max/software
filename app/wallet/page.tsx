"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./app.module.css";
import { useSession } from "../session";
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

type Activity = {
  id: string;
  kind: "DEPOSIT" | "PAYOUT";
  method: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
};

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function HomePage() {
  const router = useRouter();
  const { user } = useSession();
  const name = user?.name?.split(" ")[0] ?? "there";

  const [balance, setBalance] = useState<number | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    let alive = true;
    fetch("/api/wallet", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setBalance(typeof data.balance === "number" ? data.balance : 0);
        setActivity(Array.isArray(data.activity) ? data.activity : []);
      })
      .catch(() => alive && setBalance(0));
    return () => {
      alive = false;
    };
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
          <b>G</b>
          <span>GameHub</span>
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
              <span className={styles.balLabel}>GameHub balance</span>
              <span className={styles.eye} aria-label="Toggle balance">
                <EyeIcon />
              </span>
            </div>
            <div className={styles.balance}>
              {balance === null ? "—" : money(balance)}
            </div>

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
        {activity.length === 0 ? (
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
        ) : (
          <div className={styles.list}>
            {activity.map((a) => (
              <div key={a.id} className={styles.listItem}>
                <span className={styles.listIcon}>
                  {a.kind === "DEPOSIT" ? <PlusIcon /> : <ReceiptIcon />}
                </span>
                <span className={styles.listLabel}>
                  {a.kind === "DEPOSIT" ? "Add funds" : "Cash out"} · {a.method}
                  <br />
                  <span className={styles.activityMeta}>
                    {new Date(a.createdAt).toLocaleDateString()} ·{" "}
                    {a.status.toLowerCase()}
                  </span>
                </span>
                <span
                  className={
                    a.kind === "DEPOSIT" ? styles.amtIn : styles.amtOut
                  }
                >
                  {a.kind === "DEPOSIT" ? "+" : "−"}
                  {money(a.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
