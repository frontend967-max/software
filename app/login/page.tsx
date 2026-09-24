"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../wallet/app.module.css";
import { setSession } from "../wallet/auth";
import { MailIcon, LockIcon } from "../wallet/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErr("Enter your email and password.");
      return;
    }
    const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setSession({ name: name || "Player", email: email.trim() });
    router.replace("/wallet");
  };

  return (
    <>
      <div className={styles.appBg} />
    <form className={styles.auth} onSubmit={submit}>
      <div className={styles.authLogo}>
        <b>$L</b>
        <span>sweep</span>
      </div>

      <h1 className={styles.authTitle}>Welcome back</h1>
      <p className={styles.authSub}>Log in to your SL Sweep account.</p>

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

      <button className={styles.authBtn} type="submit">
        Log in
      </button>

      <p className={styles.authSwap}>
        Don&apos;t have an account?{" "}
        <a onClick={() => router.push("/signup")}>Sign up</a>
      </p>
    </form>
    </>
  );
}
