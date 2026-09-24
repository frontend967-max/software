"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./app.module.css";
import { useSession } from "../session";
import {
  HomeIcon,
  GameIcon,
  PlusIcon,
  CashOutIcon,
  AccountIcon,
  LogoutIcon,
  ShieldIcon,
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
  const { user, logout } = useSession();

  const isActive = (route: string) =>
    route === "/wallet" ? pathname === "/wallet" : pathname.startsWith(route);

  const initials = (user?.name ?? "G")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sbLogo}>
        <span className={styles.sbLogoMark}>
          <b>G</b>
          <span>Hub</span>
        </span>
        <span className={styles.sbLogoText}>GameHub</span>
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
        {user?.role === "ADMIN" && (
          <button
            className={styles.sbItem}
            onClick={() => router.push("/admin")}
          >
            <span className={styles.sbIcon}>
              <ShieldIcon />
            </span>
            Admin
          </button>
        )}
      </nav>

      <div className={styles.sbFooter}>
        <button className={styles.sbUser} onClick={() => router.push("/wallet/account")}>
          <span className={styles.sbAvatar}>{initials}</span>
          <span className={styles.sbUserInfo}>
            <span className={styles.sbUserName}>{user?.name ?? "Guest"}</span>
            <span className={styles.sbUserEmail}>{user?.email ?? ""}</span>
          </span>
        </button>
        <button className={styles.sbLogout} onClick={logout} aria-label="Log out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
