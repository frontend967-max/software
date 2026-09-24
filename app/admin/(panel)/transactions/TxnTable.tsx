"use client";

import { useState } from "react";
import styles from "../../admin.module.css";

type Txn = {
  id: string;
  userName: string;
  userEmail: string;
  kind: "DEPOSIT" | "PAYOUT";
  method: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "DECLINED";
  note: string | null;
  createdAt: string;
};

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const pillClass = (s: Txn["status"]) =>
  s === "APPROVED"
    ? styles.pillApproved
    : s === "DECLINED"
      ? styles.pillDeclined
      : styles.pillPending;

export default function TxnTable({ initial }: { initial: Txn[] }) {
  const [rows, setRows] = useState<Txn[]>(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  const act = async (id: string, action: "approve" | "decline") => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setRows((rs) =>
          rs.map((r) => (r.id === id ? { ...r, status: data.status } : r)),
        );
      }
    } catch {
      /* ignore */
    } finally {
      setBusyId(null);
    }
  };

  if (rows.length === 0) {
    return <div className={styles.emptyState}>No transactions yet.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Type</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <td>
                <div style={{ fontWeight: 700 }}>{t.userName}</div>
                <div className={styles.muted} style={{ fontSize: 12 }}>
                  {t.userEmail}
                </div>
              </td>
              <td>{t.kind === "DEPOSIT" ? "Deposit" : "Payout"}</td>
              <td className={styles.muted}>{t.method}</td>
              <td className={styles.mono}>{money(t.amount)}</td>
              <td>
                <span className={`${styles.pill} ${pillClass(t.status)}`}>
                  {t.status}
                </span>
              </td>
              <td className={styles.muted}>
                {new Date(t.createdAt).toLocaleDateString()}
              </td>
              <td>
                {t.status === "PENDING" ? (
                  <div className={styles.rowActions}>
                    <button
                      className={styles.btnApprove}
                      disabled={busyId === t.id}
                      onClick={() => act(t.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className={styles.btnDecline}
                      disabled={busyId === t.id}
                      onClick={() => act(t.id, "decline")}
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className={styles.muted}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
