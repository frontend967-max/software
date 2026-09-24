"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../wallet/app.module.css";
import { setSession } from "../wallet/auth";
import { UserIcon, MailIcon, LockIcon } from "../wallet/icons";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErr("Please fill in every field.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setSession({ name: name.trim(), email: email.trim() });
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

      <h1 className={styles.authTitle}>Create account</h1>
      <p className={styles.authSub}>Join SL Sweep in under a minute.</p>

      <div className={styles.field}>
        <label>Full name</label>
        <div className={styles.inputWrap}>
          <UserIcon />
          <input
            type="text"
            placeholder="Ling Chen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
      </div>

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>

      {err && <div className={styles.authErr}>{err}</div>}

      <button className={styles.authBtn} type="submit">
        Create account
      </button>

      <p className={styles.authSwap}>
        Already have an account?{" "}
        <a onClick={() => router.push("/login")}>Log in</a>
      </p>

      <p className={styles.authTerms}>
        By continuing you agree to the Terms &amp; Conditions and Privacy Policy.
        18+ only. Play responsibly.
      </p>
    </form>
    </>
  );
}
