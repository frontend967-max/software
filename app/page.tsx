"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./wallet/auth";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getSession() ? "/wallet" : "/login");
  }, [router]);

  return <div style={{ minHeight: "100vh", background: "#fff" }} />;
}
