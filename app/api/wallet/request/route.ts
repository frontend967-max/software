import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserBalance } from "@/lib/queries";

export const runtime = "nodejs";

const METHODS = ["CASH", "CARD", "BITCOIN", "OTHER"] as const;
type Method = (typeof METHODS)[number];

/**
 * Records a deposit or payout REQUEST (status PENDING) for admin approval.
 * This is bookkeeping only — no real money is collected or paid out here.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { kind?: string; method?: string; amount?: number; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const kind = body.kind === "PAYOUT" ? "PAYOUT" : body.kind === "DEPOSIT" ? "DEPOSIT" : null;
  if (!kind) {
    return NextResponse.json({ error: "Invalid request type." }, { status: 400 });
  }

  const method: Method = METHODS.includes(body.method as Method)
    ? (body.method as Method)
    : "OTHER";

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
  }

  // For payout requests, don't let a user request more than their balance.
  if (kind === "PAYOUT") {
    const balance = await getUserBalance(session.uid);
    if (amount > balance) {
      return NextResponse.json(
        { error: "Payout amount exceeds your available balance." },
        { status: 400 },
      );
    }
  }

  const tx = await prisma.transaction.create({
    data: {
      userId: session.uid,
      kind,
      method,
      amount: amount.toFixed(2),
      status: "PENDING",
      note: body.note?.slice(0, 200),
    },
  });

  return NextResponse.json({ id: tx.id, status: tx.status });
}
