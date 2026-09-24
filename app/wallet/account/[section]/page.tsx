"use client";

import { use } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { ChevronUpIcon } from "../../icons";

const TITLES: Record<string, string> = {
  "payment-methods": "Payment methods",
  "promo-codes": "Promo codes",
  "invite-friends": "Invite friends",
  security: "Security",
  notifications: "Notifications",
  help: "Help & support",
  contact: "Contact us",
};

export default function SectionStub({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = use(params);
  const title =
    TITLES[section] ??
    section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={styles.screen}>
      <InnerHeader title={title} />
      <div className={styles.body}>
        <div className={styles.stub}>
          <div className={styles.stubIcon}>
            <ChevronUpIcon />
          </div>
          <div className={styles.stubTitle}>Coming soon</div>
          <p className={styles.stubText}>
            The “{title}” screen is on the way. Tell us what you want here and
            we’ll build it into this section next.
          </p>
        </div>
      </div>
    </div>
  );
}
