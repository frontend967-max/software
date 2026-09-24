"use client";

import styles from "./app.module.css";
import { HeadsetIcon } from "./icons";

export default function SupportFab() {
  return (
    <button className={styles.fab} aria-label="Contact support" title="Support">
      <HeadsetIcon />
    </button>
  );
}
