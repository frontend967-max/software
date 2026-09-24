"use client";

import { useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { UserIcon, MailIcon, ChatIcon, PhoneIcon, CheckIcon } from "../../icons";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General question",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSent(true);
      setForm({ name: "", email: "", topic: "General question", message: "" });
    }
  };

  return (
    <div className={styles.screen}>
      <InnerHeader title="Contact us" />
      <div className={styles.body}>
        <p className={styles.formIntro}>
          Send us a message and we&apos;ll get back to you fast — usually within
          a few minutes.
        </p>

        <div className={styles.formGroupTitle}>Reach us directly</div>
        <div className={styles.methodCard}>
          <span className={styles.methodLogo}>
            <ChatIcon />
          </span>
          <div className={styles.methodBody}>
            <div className={styles.methodName}>Live chat</div>
            <div className={styles.methodSub}>24/7 · fastest response</div>
          </div>
        </div>
        <div className={styles.methodCard}>
          <span className={styles.methodLogo}>
            <MailIcon />
          </span>
          <div className={styles.methodBody}>
            <div className={styles.methodName}>support@gamehub.gg</div>
            <div className={styles.methodSub}>Replies within a few hours</div>
          </div>
        </div>
        <div className={styles.methodCard}>
          <span className={styles.methodLogo}>
            <PhoneIcon />
          </span>
          <div className={styles.methodBody}>
            <div className={styles.methodName}>+1 (800) 555-0142</div>
            <div className={styles.methodSub}>Mon–Sun · 8am–2am ET</div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.formGroupTitle}>Send a message</div>
        <form onSubmit={submit}>
          <div className={styles.formGrid}>
            <div>
              <label className={styles.fldLabel}>Your name</label>
              <div className={styles.fldBox}>
                <UserIcon />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ling Chen"
                />
              </div>
            </div>
            <div>
              <label className={styles.fldLabel}>Email</label>
              <div className={styles.fldBox}>
                <MailIcon />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className={styles.fldLabel}>Topic</label>
              <div className={styles.fldBox}>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                >
                  <option>General question</option>
                  <option>Deposits &amp; withdrawals</option>
                  <option>Bonuses &amp; promos</option>
                  <option>Account &amp; security</option>
                </select>
              </div>
            </div>
            <div>
              <label className={styles.fldLabel}>Message</label>
              <textarea
                className={styles.textarea}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
              />
            </div>
          </div>
          {sent && (
            <div className={styles.savedToast} style={{ marginTop: 12 }}>
              <CheckIcon /> Message sent — we&apos;ll be in touch soon
            </div>
          )}
          <button className={styles.btnBlock} style={{ marginTop: 16 }} type="submit">
            Send message
          </button>
          <p className={styles.hint} style={{ marginBottom: 0 }}>
            This is a demo form — nothing is actually sent.
          </p>
        </form>
      </div>
    </div>
  );
}
