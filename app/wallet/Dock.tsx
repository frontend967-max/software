"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./app.module.css";
import {
  HomeIcon,
  GameIcon,
  PlusIcon,
  CashOutIcon,
  AccountIcon,
} from "./icons";

export default function Dock() {
  const pathname = usePathname();
  const router = useRouter();

  const is = (p: string) => pathname === p;

  return (
    <nav className={styles.dock}>
      <button
        className={`${styles.dockItem} ${is("/wallet") ? styles.active : ""}`}
        onClick={() => router.push("/wallet")}
      >
        <HomeIcon />
        <span className={styles.dockLabel}>Home</span>
      </button>
      <button
        className={`${styles.dockItem} ${is("/wallet/games") ? styles.active : ""}`}
        onClick={() => router.push("/wallet/games")}
      >
        <GameIcon />
        <span className={styles.dockLabel}>Games</span>
      </button>
      <button
        className={`${styles.dockItem} ${styles.dockFab} ${
          is("/wallet/add-funds") ? styles.active : ""
        }`}
        onClick={() => router.push("/wallet/add-funds")}
      >
        <span className={styles.dockFabCircle}>
          <PlusIcon />
        </span>
        <span className={styles.dockLabel}>Add funds</span>
      </button>
      <button
        className={`${styles.dockItem} ${is("/wallet/cash-out") ? styles.active : ""}`}
        onClick={() => router.push("/wallet/cash-out")}
      >
        <CashOutIcon />
        <span className={styles.dockLabel}>Cash out</span>
      </button>
      <button
        className={`${styles.dockItem} ${is("/wallet/account") ? styles.active : ""}`}
        onClick={() => router.push("/wallet/account")}
      >
        <AccountIcon />
        <span className={styles.dockLabel}>Account</span>
      </button>
    </nav>
  );
}
