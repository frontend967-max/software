import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserWallet } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const wallet = await getUserWallet(session.uid);
  return NextResponse.json(wallet);
}
