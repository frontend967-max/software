"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app.module.css";
import { clearSession, getSession } from "../auth";
import {
  UserIcon,
  ShieldIcon,
  BellIcon,
  HeadsetIcon,
  ChevronIcon,
  LogoutIcon,
  MailIcon,
  CardIcon,
  GiftIcon,
  TagIcon,
} from "../icons";

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5L20 6" />
  </svg>
);

export default function ProfilePage() {
  const router = useRouter();
  const [sess, setSess] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setSess(getSession());
  }, []);

  const name = sess?.name ?? "Guest";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const account = [
    { label: "Personal details", sub: "Name, phone, address", icon: <UserIcon />, slug: "personal-details" },
    { label: "Payment methods", sub: "CashApp, cards", icon: <CardIcon />, slug: "payment-methods" },
    { label: "Promo codes", sub: "Redeem an offer", icon: <TagIcon />, slug: "promo-codes" },
    { label: "Invite friends", sub: "Earn rewards", icon: <GiftIcon />, slug: "invite-friends" },
  ];
  const settings = [
    { label: "Security", sub: "Password, 2-step verification", icon: <ShieldIcon />, slug: "security" },
    { label: "Notifications", sub: "Push, email, SMS", icon: <BellIcon />, slug: "notifications" },
  ];
  const support = [
    { label: "Help & support", sub: "Live chat, FAQ", icon: <HeadsetIcon />, slug: "help" },
    { label: "Contact us", sub: "support@slsweep.com", icon: <MailIcon />, slug: "contact" },
  ];

  const logout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <div className={styles.screen}>
      <div className={styles.pageHead}>
        <h1>Profile</h1>
      </div>

      <div className={styles.body}>
       <div className={styles.deskGrid} style={{ marginTop: 0 }}>
        <div>
        <div className={styles.profileTop}>
          <span className={styles.acctAvatar}>
            {initials || <UserIcon />}
            <span className={styles.verifiedDot}>
              <Check />
            </span>
          </span>
          <div>
            <div className={styles.acctName}>{name}</div>
            <div className={styles.acctEmail}>{sess?.email ?? ""}</div>
            <div className={styles.acctSince}>Member since Sep 2026</div>
          </div>
        </div>

        <span className={styles.verifyPill}>
          <ShieldIcon /> Identity verified
        </span>

        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <div className={styles.statVal}>$0.00</div>
            <div className={styles.statLbl}>Balance</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>0</div>
            <div className={styles.statLbl}>Games</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>$0</div>
            <div className={styles.statLbl}>Cashed out</div>
          </div>
        </div>
        </div>

        <div>
        <div className={styles.groupTitle}>Account</div>
        <div className={styles.group}>
          {account.map((r) => (
            <button
              key={r.label}
              className={styles.groupRow}
              onClick={() => router.push(`/wallet/account/${r.slug}`)}
            >
              <span className={styles.grIcon}>{r.icon}</span>
              <span className={styles.grBody}>
                <span className={styles.grLabel}>{r.label}</span>
                <div className={styles.grSub}>{r.sub}</div>
              </span>
              <span className={styles.grTrail}>
                <ChevronIcon />
              </span>
            </button>
          ))}
        </div>

        <div className={styles.groupTitle}>Settings</div>
        <div className={styles.group}>
          {settings.map((r) => (
            <button
              key={r.label}
              className={styles.groupRow}
              onClick={() => router.push(`/wallet/account/${r.slug}`)}
            >
              <span className={styles.grIcon}>{r.icon}</span>
              <span className={styles.grBody}>
                <span className={styles.grLabel}>{r.label}</span>
                <div className={styles.grSub}>{r.sub}</div>
              </span>
              <span className={styles.grTrail}>
                <ChevronIcon />
              </span>
            </button>
          ))}
        </div>

        <div className={styles.groupTitle}>Support</div>
        <div className={styles.group}>
          {support.map((r) => (
            <button
              key={r.label}
              className={styles.groupRow}
              onClick={() => router.push(`/wallet/account/${r.slug}`)}
            >
              <span className={styles.grIcon}>{r.icon}</span>
              <span className={styles.grBody}>
                <span className={styles.grLabel}>{r.label}</span>
                <div className={styles.grSub}>{r.sub}</div>
              </span>
              <span className={styles.grTrail}>
                <ChevronIcon />
              </span>
            </button>
          ))}
        </div>

        <button className={styles.logoutBtn} onClick={logout}>
          <LogoutIcon />
          Log out
        </button>
        <div className={styles.appVersion}>SL Sweep · v1.0.0</div>
        </div>
       </div>
      </div>
    </div>
  );
}
