"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { ChatIcon, MailIcon, ChevronDownIcon, ChevronIcon } from "../../icons";

const FAQS = [
  {
    q: "How long do cash-outs take?",
    a: "Most CashApp and card cash-outs clear within 15 minutes of approval. Bank transfers can take 1–3 business days.",
  },
  {
    q: "How do I add funds?",
    a: "Tap Add funds from the home screen or the bottom bar, pick an amount and a payment method, then confirm.",
  },
  {
    q: "Why is my balance $0.00?",
    a: "Your GameHub balance starts at $0.00. Add funds or move game winnings back to your balance to top it up.",
  },
  {
    q: "How do I set up a game?",
    a: "Open the Games tab, choose a game and tap Set up game. You'll get a game account you can load funds into.",
  },
  {
    q: "Is my money safe?",
    a: "Yes. Every transaction uses bank-grade encryption, and your identity is verified before cash-outs.",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={styles.screen}>
      <InnerHeader title="Help & support" />
      <div className={styles.body}>
        <p className={styles.formIntro}>
          Find quick answers, or reach our team any time — we&apos;re here 24/7.
        </p>

        <div className={styles.formGroupTitle}>Get in touch</div>
        <button className={styles.contactTile}>
          <span className={styles.methodLogo}>
            <ChatIcon />
          </span>
          <div className={styles.methodBody}>
            <div className={styles.methodName}>Live chat</div>
            <div className={styles.methodSub}>Instant help, 24 hours a day</div>
          </div>
          <span className={styles.grTrail}>
            <ChevronIcon />
          </span>
        </button>
        <button
          className={styles.contactTile}
          onClick={() => router.push("/wallet/account/contact")}
        >
          <span className={styles.methodLogo}>
            <MailIcon />
          </span>
          <div className={styles.methodBody}>
            <div className={styles.methodName}>Email us</div>
            <div className={styles.methodSub}>support@gamehub.gg</div>
          </div>
          <span className={styles.grTrail}>
            <ChevronIcon />
          </span>
        </button>

        <div className={styles.divider} />

        <div className={styles.formGroupTitle}>Frequently asked</div>
        {FAQS.map((f, i) => (
          <div key={f.q} className={styles.faqItem}>
            <button
              className={`${styles.faqQ} ${open === i ? styles.open : ""}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{f.q}</span>
              <ChevronDownIcon />
            </button>
            {open === i && <div className={styles.faqA}>{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
