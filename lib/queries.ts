import { prisma } from "./db";
import { getGame } from "@/app/wallet/games/data";

/** Derived balance for a single user: approved deposits - approved payouts. */
export async function getUserBalance(userId: string): Promise<number> {
  const [deposits, payouts] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, kind: "DEPOSIT", status: "APPROVED" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, kind: "PAYOUT", status: "APPROVED" },
    }),
  ]);
  return Number(deposits._sum.amount ?? 0) - Number(payouts._sum.amount ?? 0);
}

export type WalletActivity = {
  id: string;
  kind: "DEPOSIT" | "PAYOUT";
  method: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
};

/** Balance + recent activity for the wallet home screen. */
export async function getUserWallet(userId: string): Promise<{
  balance: number;
  activity: WalletActivity[];
}> {
  const [balance, txns] = await Promise.all([
    getUserBalance(userId),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);
  return {
    balance,
    activity: txns.map((t) => ({
      id: t.id,
      kind: t.kind,
      method: t.method,
      amount: Number(t.amount),
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    })),
  };
}

/** Build a userId -> approved balance map in two grouped queries. */
async function balanceMap(): Promise<Map<string, number>> {
  const [deps, pays] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      where: { kind: "DEPOSIT", status: "APPROVED" },
    }),
    prisma.transaction.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      where: { kind: "PAYOUT", status: "APPROVED" },
    }),
  ]);
  const map = new Map<string, number>();
  for (const d of deps) map.set(d.userId, Number(d._sum.amount ?? 0));
  for (const p of pays)
    map.set(p.userId, (map.get(p.userId) ?? 0) - Number(p._sum.amount ?? 0));
  return map;
}

/** Per-user rows for the admin users table. */
export async function getAdminUsers() {
  const [users, balances] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { gamePlays: true } } },
    }),
    balanceMap(),
  ]);
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    gamesPlayed: u._count.gamePlays,
    balance: balances.get(u.id) ?? 0,
  }));
}

/** All transactions (newest first) for the admin transactions view. */
export async function getAdminTransactions() {
  const txns = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
    take: 300,
  });
  return txns.map((t) => ({
    id: t.id,
    userName: t.user.name,
    userEmail: t.user.email,
    kind: t.kind,
    method: t.method,
    amount: Number(t.amount),
    status: t.status,
    note: t.note,
    createdAt: t.createdAt.toISOString(),
  }));
}

/** Game aggregates for the games page. */
export async function getGameStats() {
  const [playGroups, totalPlays] = await Promise.all([
    prisma.gamePlay.groupBy({
      by: ["gameSlug"],
      _count: { gameSlug: true },
      orderBy: { _count: { gameSlug: "desc" } },
    }),
    prisma.gamePlay.count(),
  ]);
  const gamePlays = playGroups.map((g) => ({
    slug: g.gameSlug,
    name: getGame(g.gameSlug)?.name ?? g.gameSlug,
    plays: g._count.gameSlug,
  }));
  return { totalPlays, gamePlays, favourite: gamePlays[0] ?? null };
}

/** Rich metrics for the admin overview dashboard. */
export async function getAdminOverview() {
  const now = Date.now();
  const since14 = new Date(now - 14 * 86400000);
  const since7 = new Date(now - 7 * 86400000);

  const [
    totalUsers,
    depAgg,
    payAgg,
    pendingAgg,
    declinedCount,
    biggest,
    newUsers7d,
    methodGroups,
    recentTx,
    trendRows,
    users,
    balances,
    game,
    activePlayers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      _count: true,
      _avg: { amount: true },
      where: { kind: "DEPOSIT", status: "APPROVED" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      _count: true,
      where: { kind: "PAYOUT", status: "APPROVED" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      _count: true,
      where: { status: "PENDING" },
    }),
    prisma.transaction.count({ where: { status: "DECLINED" } }),
    prisma.transaction.findFirst({
      where: { kind: "DEPOSIT", status: "APPROVED" },
      orderBy: { amount: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.user.count({ where: { role: "USER", createdAt: { gte: since7 } } }),
    prisma.transaction.groupBy({
      by: ["method"],
      _sum: { amount: true },
      _count: true,
      where: { kind: "DEPOSIT", status: "APPROVED" },
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.transaction.findMany({
      where: { kind: "DEPOSIT", status: "APPROVED", createdAt: { gte: since14 } },
      select: { amount: true, createdAt: true },
    }),
    prisma.user.findMany({ select: { id: true, name: true, email: true } }),
    balanceMap(),
    getGameStats(),
    prisma.gamePlay.findMany({ distinct: ["userId"], select: { userId: true } }),
  ]);

  const totalIn = Number(depAgg._sum.amount ?? 0);
  const totalOut = Number(payAgg._sum.amount ?? 0);

  // 14-day deposit trend bucketed by day.
  const buckets: { day: string; amount: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    buckets.push({
      day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: 0,
    });
  }
  const dayIndex = (dt: Date) =>
    13 - Math.floor((now - dt.getTime()) / 86400000);
  for (const r of trendRows) {
    const idx = dayIndex(r.createdAt);
    if (idx >= 0 && idx < 14) buckets[idx].amount += Number(r.amount);
  }

  const topPlayers = users
    .map((u) => ({
      name: u.name,
      email: u.email,
      balance: balances.get(u.id) ?? 0,
    }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 6);

  return {
    totalUsers,
    totalIn,
    totalOut,
    totalBalance: totalIn - totalOut,
    depositCount: depAgg._count,
    payoutCount: payAgg._count,
    avgDeposit: Number(depAgg._avg.amount ?? 0),
    pendingCount: pendingAgg._count,
    pendingAmount: Number(pendingAgg._sum.amount ?? 0),
    declinedCount,
    newUsers7d,
    activePlayers: activePlayers.length,
    biggestDeposit: biggest
      ? { amount: Number(biggest.amount), name: biggest.user.name }
      : null,
    methodBreakdown: methodGroups
      .map((m) => ({
        method: m.method,
        amount: Number(m._sum.amount ?? 0),
        count: m._count,
      }))
      .sort((a, b) => b.amount - a.amount),
    trend: buckets,
    topPlayers,
    favourite: game.favourite,
    gamePlays: game.gamePlays,
    totalPlays: game.totalPlays,
    recent: recentTx.map((t) => ({
      id: t.id,
      userName: t.user.name,
      kind: t.kind,
      method: t.method,
      amount: Number(t.amount),
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    })),
  };
}
