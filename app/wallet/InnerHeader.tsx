"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./app.module.css";
import { ArrowLeftIcon } from "./icons";

export default function InnerHeader({
  title,
  fallback = "/wallet/account",
  trailing,
}: {
  title: string;
  fallback?: string;
  trailing?: ReactNode;
}) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <div className={styles.pageHead}>
      <button className={styles.headRound} onClick={goBack} aria-label="Back">
        <ArrowLeftIcon />
      </button>
      <h1>{title}</h1>
      {trailing}
    </div>
  );
}
