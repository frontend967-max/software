import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import styles from "../admin.module.css";
import AdminNav from "./AdminNav";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already guards this, but double-check server-side.
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/admin/login");

  return (
    <div className={styles.shell}>
      <AdminNav name={session.name} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
