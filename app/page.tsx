import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  redirect(session ? "/wallet" : "/login");
}
