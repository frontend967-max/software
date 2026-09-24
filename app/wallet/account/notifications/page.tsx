"use client";

import { useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      className={`${styles.switch} ${on ? styles.on : ""}`}
      onClick={onClick}
      aria-pressed={on}
    />
  );
}

type Row = { key: string; label: string; sub: string; on: boolean };

export default function NotificationsPage() {
  const [push, setPush] = useState<Row[]>([
    { key: "p1", label: "Deposits & cash-outs", sub: "Status of your transactions", on: true },
    { key: "p2", label: "Bonuses & promos", sub: "New offers and free spins", on: true },
    { key: "p3", label: "Game updates", sub: "New games and jackpots", on: false },
  ]);
  const [email, setEmail] = useState<Row[]>([
    { key: "e1", label: "Account & security", sub: "Sign-ins and changes", on: true },
    { key: "e2", label: "Weekly summary", sub: "Your activity recap", on: false },
    { key: "e3", label: "Marketing", sub: "Offers and newsletters", on: false },
  ]);
  const [sms, setSms] = useState<Row[]>([
    { key: "s1", label: "Security codes", sub: "Two-step verification", on: true },
    { key: "s2", label: "Cash-out alerts", sub: "When a payout is sent", on: false },
  ]);

  const toggle = (
    list: Row[],
    set: (r: Row[]) => void,
    key: string
  ) => set(list.map((r) => (r.key === key ? { ...r, on: !r.on } : r)));

  const Section = ({
    title,
    rows,
    set,
  }: {
    title: string;
    rows: Row[];
    set: (r: Row[]) => void;
  }) => (
    <>
      <div className={styles.formGroupTitle}>{title}</div>
      <div style={{ marginBottom: 8 }}>
        {rows.map((r) => (
          <div key={r.key} className={styles.switchRow}>
            <div className={styles.switchBody}>
              <div className={styles.switchLabel}>{r.label}</div>
              <div className={styles.switchSub}>{r.sub}</div>
            </div>
            <Switch on={r.on} onClick={() => toggle(rows, set, r.key)} />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className={styles.screen}>
      <InnerHeader title="Notifications" />
      <div className={styles.body}>
        <p className={styles.formIntro}>
          Choose how you want to hear from SL Sweep.
        </p>
        <Section title="Push" rows={push} set={setPush} />
        <div className={styles.divider} />
        <Section title="Email" rows={email} set={setEmail} />
        <div className={styles.divider} />
        <Section title="SMS" rows={sms} set={setSms} />
      </div>
    </div>
  );
}
