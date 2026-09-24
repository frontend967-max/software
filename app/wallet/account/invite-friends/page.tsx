"use client";

import { useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { CopyIcon, ShareIcon, CheckIcon } from "../../icons";

export default function InviteFriendsPage() {
  const [copied, setCopied] = useState(false);
  const code = "LING-SL50";
  const link = `https://app.gamehub.gg/r/${code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const steps = [
    { t: "Share your link", p: "Send your personal invite link to a friend." },
    { t: "They sign up & deposit", p: "Your friend joins and adds their first funds." },
    { t: "You both earn $50", p: "$50 in bonus credits lands in each account." },
  ];

  return (
    <div className={styles.screen}>
      <InnerHeader title="Invite friends" />
      <div className={styles.body}>
        <p className={styles.formIntro}>
          Give $50, get $50. Invite friends to GameHub and you both earn bonus
          credits when they make their first deposit.
        </p>

        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <div className={styles.statVal}>0</div>
            <div className={styles.statLbl}>Invited</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>0</div>
            <div className={styles.statLbl}>Joined</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>$0</div>
            <div className={styles.statLbl}>Earned</div>
          </div>
        </div>

        <div className={styles.formGroupTitle}>Your invite link</div>
        <div className={styles.referBox}>
          <span className={styles.referCode}>{code}</span>
          <button className={styles.copyBtn} onClick={copy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        {copied && (
          <div className={styles.savedToast} style={{ marginBottom: 12 }}>
            <CheckIcon /> Link copied to clipboard
          </div>
        )}
        <button className={styles.btnBlock} onClick={copy}>
          <ShareIcon /> Share invite link
        </button>

        <div className={styles.divider} />

        <div className={styles.formGroupTitle}>How it works</div>
        <div className={styles.stepList}>
          {steps.map((s, i) => (
            <div key={s.t} className={styles.stepItem}>
              <span className={styles.stepNum}>{i + 1}</span>
              <div className={styles.stepTx}>
                <b>{s.t}</b>
                <p>{s.p}</p>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.hint} style={{ marginBottom: 0 }}>
          Rewards are credited after your friend&apos;s first deposit clears.
          18+ only. Terms apply.
        </p>
      </div>
    </div>
  );
}
