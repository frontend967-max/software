"use client";

import { useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { TagIcon, CheckIcon, GiftIcon } from "../../icons";

export default function PromoCodesPage() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const valid = code.trim().toUpperCase() === "WELCOME200";
    setMsg(
      valid
        ? { ok: true, text: "Code applied! 200% match added to your next deposit." }
        : { ok: false, text: "That code is invalid or has expired." }
    );
  };

  const available = [
    { code: "WELCOME200", desc: "200% match on your first deposit", tag: "New players" },
    { code: "RELOAD50", desc: "50% reload bonus, evenings 6pm–12am", tag: "Daily" },
    { code: "FREESPIN", desc: "100 free spins on Golden Ace", tag: "Slots" },
  ];

  return (
    <div className={styles.screen}>
      <InnerHeader title="Promo codes" />
      <div className={styles.body}>
        <p className={styles.formIntro}>
          Have a code? Enter it below to redeem your offer.
        </p>

        <form onSubmit={apply}>
          <label className={styles.fldLabel}>Promo code</label>
          <div className={styles.fldBox}>
            <TagIcon />
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setMsg(null);
              }}
              placeholder="e.g. WELCOME200"
              style={{ textTransform: "uppercase" }}
            />
          </div>
          {msg && (
            <div
              className={styles.savedToast}
              style={{
                marginTop: 12,
                background: msg.ok ? undefined : "#fdecec",
                color: msg.ok ? undefined : "#dc2626",
              }}
            >
              {msg.ok && <CheckIcon />} {msg.text}
            </div>
          )}
          <button className={styles.btnBlock} style={{ marginTop: 16 }} type="submit">
            Apply code
          </button>
        </form>

        <div className={styles.divider} />

        <div className={styles.formGroupTitle}>Available offers</div>
        {available.map((o) => (
          <div key={o.code} className={styles.methodCard}>
            <span className={styles.methodLogo}>
              <GiftIcon />
            </span>
            <div className={styles.methodBody}>
              <div className={styles.methodName}>
                {o.code} <span className={styles.badge}>{o.tag}</span>
              </div>
              <div className={styles.methodSub}>{o.desc}</div>
            </div>
            <button
              className={styles.linkBtn}
              onClick={() => {
                setCode(o.code);
                setMsg(null);
              }}
            >
              Use
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
