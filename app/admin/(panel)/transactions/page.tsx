import styles from "../../admin.module.css";
import { getAdminTransactions } from "@/lib/queries";
import TxnTable from "./TxnTable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminTransactions() {
  const txns = await getAdminTransactions();
  const pending = txns.filter((t) => t.status === "PENDING").length;

  return (
    <>
      <div className={styles.head}>
        <h1>Transactions</h1>
        <p>
          Deposit &amp; payout requests. {pending} pending review — approving a
          request updates the player&apos;s balance.
        </p>
      </div>

      <div className={styles.panel}>
        <TxnTable initial={txns} />
      </div>
    </>
  );
}
