"use client";

import { useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { LockIcon, KeyIcon, DeviceIcon, CheckIcon } from "../../icons";

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      className={`${styles.switch} ${on ? styles.on : ""}`}
      onClick={onClick}
      aria-pressed={on}
    />
  );
}

export default function SecurityPage() {
  const [twoStep, setTwoStep] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved] = useState(false);

  const changePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next && pw.next === pw.confirm) {
      setSaved(true);
      setPw({ current: "", next: "", confirm: "" });
    }
  };

  const sessions = [
    { device: "iPhone 15 · Chrome", meta: "Austin, TX · Active now", current: true },
    { device: "MacBook Pro · Safari", meta: "Austin, TX · 2 hours ago" },
  ];

  return (
    <div className={styles.screen}>
      <InnerHeader title="Security" />
      <div className={styles.body}>
        <p className={styles.formIntro}>
          Protect your account with a strong password and extra verification.
        </p>

        <div className={styles.formGroupTitle}>Change password</div>
        <form onSubmit={changePw}>
          <div className={styles.formGrid}>
            <div>
              <label className={styles.fldLabel}>Current password</label>
              <div className={styles.fldBox}>
                <LockIcon />
                <input
                  type="password"
                  value={pw.current}
                  onChange={(e) => setPw({ ...pw, current: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className={styles.fldLabel}>New password</label>
              <div className={styles.fldBox}>
                <KeyIcon />
                <input
                  type="password"
                  value={pw.next}
                  onChange={(e) => setPw({ ...pw, next: e.target.value })}
                  placeholder="At least 8 characters"
                />
              </div>
            </div>
            <div>
              <label className={styles.fldLabel}>Confirm new password</label>
              <div className={styles.fldBox}>
                <KeyIcon />
                <input
                  type="password"
                  value={pw.confirm}
                  onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
          </div>
          {saved && (
            <div className={styles.savedToast} style={{ marginTop: 12 }}>
              <CheckIcon /> Password updated
            </div>
          )}
          <button className={styles.btnBlock} style={{ marginTop: 16 }} type="submit">
            Update password
          </button>
        </form>

        <div className={styles.divider} />

        <div className={styles.formGroupTitle}>Extra verification</div>
        <div className={styles.switchRow}>
          <div className={styles.switchBody}>
            <div className={styles.switchLabel}>Two-step verification</div>
            <div className={styles.switchSub}>Require a code at every login</div>
          </div>
          <Switch on={twoStep} onClick={() => setTwoStep(!twoStep)} />
        </div>
        <div className={styles.switchRow}>
          <div className={styles.switchBody}>
            <div className={styles.switchLabel}>Biometric unlock</div>
            <div className={styles.switchSub}>Use Face ID or fingerprint</div>
          </div>
          <Switch on={biometric} onClick={() => setBiometric(!biometric)} />
        </div>
        <div className={styles.switchRow}>
          <div className={styles.switchBody}>
            <div className={styles.switchLabel}>Login alerts</div>
            <div className={styles.switchSub}>Email me about new sign-ins</div>
          </div>
          <Switch on={loginAlerts} onClick={() => setLoginAlerts(!loginAlerts)} />
        </div>

        <div className={styles.divider} />

        <div className={styles.formGroupTitle}>Active sessions</div>
        {sessions.map((s) => (
          <div key={s.device} className={styles.methodCard}>
            <span className={styles.methodLogo}>
              <DeviceIcon />
            </span>
            <div className={styles.methodBody}>
              <div className={styles.methodName}>
                {s.device}
                {s.current && <span className={styles.badge}>This device</span>}
              </div>
              <div className={styles.methodSub}>{s.meta}</div>
            </div>
            {!s.current && (
              <button className={`${styles.linkBtn} ${styles.dangerLink}`}>
                Sign out
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
