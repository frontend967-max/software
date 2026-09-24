"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import { clearSession, getSession } from "./auth";
import {
  HomeIcon,
  GameIcon,
  PlusIcon,
  CashOutIcon,
  AccountIcon,
  LogoutIcon,
} from "./icons";

const NAV = [
  { label: "Home", route: "/wallet", icon: <HomeIcon /> },
  { label: "Games", route: "/wallet/games", icon: <GameIcon /> },
  { label: "Cash out", route: "/wallet/cash-out", icon: <CashOutIcon /> },
  { label: "Account", route: "/wallet/account", icon: <AccountIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sess, setSess] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setSess(getSession());
  }, []);

  const isActive = (route: string) =>
    route === "/wallet" ? pathname === "/wallet" : pathname.startsWith(route);

  const initials = (sess?.name ?? "G")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const logout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sbLogo}>
        <span className={styles.sbLogoMark}>
          <b>$L</b>
          <span>sweep</span>
        </span>
        <span className={styles.sbLogoText}>SL Sweep</span>
      </div>

      <button
        className={styles.sbAdd}
        onClick={() => router.push("/wallet/add-funds")}
      >
        <PlusIcon /> Add funds
      </button>

      <nav className={styles.sbNav}>
        {NAV.map((n) => (
          <button
            key={n.route}
            className={`${styles.sbItem} ${isActive(n.route) ? styles.sbItemOn : ""}`}
            onClick={() => router.push(n.route)}
          >
            <span className={styles.sbIcon}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div className={styles.sbFooter}>
        <button className={styles.sbUser} onClick={() => router.push("/wallet/account")}>
          <span className={styles.sbAvatar}>{initials}</span>
          <span className={styles.sbUserInfo}>
            <span className={styles.sbUserName}>{sess?.name ?? "Guest"}</span>
            <span className={styles.sbUserEmail}>{sess?.email ?? ""}</span>
          </span>
        </button>
        <button className={styles.sbLogout} onClick={logout} aria-label="Log out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
