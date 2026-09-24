"use client";

import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { CashAppIcon, CardStackIcon, PlusIcon, BankIcon } from "../../icons";

export default function PaymentMethodsPage() {
  const methods = [
    {
      logo: <CashAppIcon />,
      name: "CashApp",
      sub: "$gamehub",
      badge: "Default",
    },
    {
      logo: <CardStackIcon />,
      name: "Visa •••• 4242",
      sub: "Expires 08/28",
    },
    {
      logo: <BankIcon />,
      name: "Chase Bank",
      sub: "Checking •••• 9910",
    },
  ];

  return (
    <div className={styles.screen}>
      <InnerHeader title="Payment methods" />
      <div className={styles.body}>
        <p className={styles.formIntro}>
          Manage the cards and accounts you use to add funds and cash out.
        </p>

        <div className={styles.formGroupTitle}>Your methods</div>
        {methods.map((m) => (
          <div key={m.name} className={styles.methodCard}>
            <span className={styles.methodLogo}>{m.logo}</span>
            <div className={styles.methodBody}>
              <div className={styles.methodName}>
                {m.name}
                {m.badge && <span className={styles.badge}>{m.badge}</span>}
              </div>
              <div className={styles.methodSub}>{m.sub}</div>
            </div>
            <button className={`${styles.linkBtn} ${styles.dangerLink}`}>
              Remove
            </button>
          </div>
        ))}

        <button className={styles.addRow} style={{ marginTop: 6 }}>
          <span className={styles.plusCircle}>
            <PlusIcon />
          </span>
          Add a payment method
        </button>

        <div className={styles.divider} />
        <p className={styles.hint} style={{ margin: 0 }}>
          Cash-outs are always returned to your original payment method where
          possible. Adding a method may require verification.
        </p>
      </div>
    </div>
  );
}
