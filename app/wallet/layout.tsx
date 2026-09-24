"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./auth";
import Dock from "./Dock";
import Sidebar from "./Sidebar";
import SupportFab from "./SupportFab";
import styles from "./app.module.css";

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return <div style={{ minHeight: "100vh", background: "#fff" }} />;
  }

  return (
    <>
      <div className={styles.appBg} />
      <Sidebar />
      <div className={styles.content}>{children}</div>
      <SupportFab />
      <Dock />
    </>
  );
}
