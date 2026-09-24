"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "../session";
import Dock from "./Dock";
import Sidebar from "./Sidebar";
import SupportFab from "./SupportFab";
import styles from "./app.module.css";

function WalletShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useSession();

  // Middleware is the real gate; this is a client-side fallback.
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className={styles.bootScreen} />;
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

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <WalletShell>{children}</WalletShell>
    </SessionProvider>
  );
}
