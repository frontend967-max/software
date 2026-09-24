"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../wallet/app.module.css";
import { MailIcon, LockIcon } from "../wallet/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErr("Enter your email and password.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Login failed.");
        setBusy(false);
        return;
      }
      router.replace("/wallet");
    } catch {
      setErr("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <>
      <div className={styles.appBg} />
    <form className={styles.auth} onSubmit={submit}>
      <div className={styles.authLogo}>
        <b>G</b>
        <span>GameHub</span>
      </div>

      <h1 className={styles.authTitle}>Welcome back</h1>
      <p className={styles.authSub}>Log in to your GameHub account.</p>

      <div className={styles.field}>
        <label>Email</label>
        <div className={styles.inputWrap}>
          <MailIcon />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Password</label>
        <div className={styles.inputWrap}>
          <LockIcon />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
      </div>

      {err && <div className={styles.authErr}>{err}</div>}

      <button className={styles.authBtn} type="submit" disabled={busy}>
        {busy ? "Logging in…" : "Log in"}
      </button>

      <p className={styles.authSwap}>
        Don&apos;t have an account?{" "}
        <a onClick={() => router.push("/signup")}>Sign up</a>
      </p>
    </form>
    </>
  );
}
