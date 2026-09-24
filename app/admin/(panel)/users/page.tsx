import styles from "../../admin.module.css";
import { getAdminUsers } from "@/lib/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function AdminUsers() {
  const users = await getAdminUsers();

  return (
    <>
      <div className={styles.head}>
        <h1>Users</h1>
        <p>{users.length} registered accounts.</p>
      </div>

      <div className={styles.panel}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Balance</th>
                <th>Games played</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No users yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700 }}>{u.name}</td>
                    <td className={styles.muted}>{u.email}</td>
                    <td>
                      {u.role === "ADMIN" ? (
                        <span className={`${styles.pill} ${styles.roleTag}`}>
                          ADMIN
                        </span>
                      ) : (
                        <span className={styles.muted}>User</span>
                      )}
                    </td>
                    <td className={styles.mono}>{money(u.balance)}</td>
                    <td className={styles.mono}>{u.gamesPlayed}</td>
                    <td className={styles.muted}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
