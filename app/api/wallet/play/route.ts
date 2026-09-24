import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getGame } from "@/app/wallet/games/data";

export const runtime = "nodejs";

/** Records that the current user played a game (feeds favourite-game stats). */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const slug = (body.slug ?? "").trim();
  if (!slug || !getGame(slug)) {
    return NextResponse.json({ error: "Unknown game." }, { status: 400 });
  }

  await prisma.gamePlay.create({ data: { userId: session.uid, gameSlug: slug } });
  return NextResponse.json({ ok: true });
}
