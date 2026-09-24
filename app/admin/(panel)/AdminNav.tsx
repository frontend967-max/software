"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "../admin.module.css";
import {
  ChartIcon,
  UsersIcon,
  ReceiptIcon,
  GameIcon,
  LogoutIcon,
} from "../../wallet/icons";

const NAV = [
  { label: "Overview", route: "/admin", icon: <ChartIcon /> },
  { label: "Users", route: "/admin/users", icon: <UsersIcon /> },
  { label: "Transactions", route: "/admin/transactions", icon: <ReceiptIcon /> },
  { label: "Games", route: "/admin/games", icon: <GameIcon /> },
];

export default function AdminNav({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (route: string) =>
    route === "/admin" ? pathname === "/admin" : pathname.startsWith(route);

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.replace("/admin/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>G</span>
        <span className={styles.brandText}>
          GameHub
          <small>Admin</small>
        </span>
      </div>

      {NAV.map((n) => (
        <button
          key={n.route}
          className={`${styles.navItem} ${isActive(n.route) ? styles.navItemOn : ""}`}
          onClick={() => router.push(n.route)}
        >
          <span className={styles.navIcon}>{n.icon}</span>
          {n.label}
        </button>
      ))}

      <div className={styles.navSpacer} />

      <div className={styles.navUser}>
        <span className={styles.avatar}>{initials || "A"}</span>
        <span className={styles.navUserInfo}>
          <span className={styles.navUserName}>{name}</span>
          <span className={styles.navUserRole}>ADMIN</span>
        </span>
        <button className={styles.logout} onClick={logout} aria-label="Log out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
