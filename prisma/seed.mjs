import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN = { email: "admin@gamehub.gg", name: "GameHub Admin", password: "admin123" };

const FIRST = [
  "Ava", "Liam", "Mia", "Noah", "Zoe", "Ethan", "Isla", "Lucas", "Aria", "Mason",
  "Nora", "Kai", "Ruby", "Leo", "Ivy", "Owen", "Maya", "Jack", "Luna", "Eli",
  "Hana", "Finn", "Sofia", "Max", "Elena", "Cole", "Nina", "Reed", "Tara", "Dev",
  "Priya", "Omar", "Lena", "Theo", "Zara", "Ravi", "Cleo", "Yara", "Sam", "Nia",
  "Diego", "Amara", "Jonah", "Freya", "Marco", "Talia", "Rhys", "Esha",
];
const LAST = [
  "Reed", "Cortez", "Thompson", "Patel", "Kim", "Rivera", "Nguyen", "Brooks",
  "Silva", "Okafor", "Haddad", "Rossi", "Novak", "Chen", "Ali", "Wright", "Diaz",
  "Ford", "Mehta", "Park", "Lowe", "Costa", "Bauer", "Shah",
];

const GAMES = ["cashfrenzy", "firekirin", "gamevault", "juwa", "juwa-2", "lasvegas-sweeps", "orion-stars", "milky-way"];
const METHODS = ["CASH", "CARD", "BITCOIN", "OTHER"];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const money = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));
const daysAgo = (d) => new Date(Date.now() - d * 86400000 - rand(0, 86400000));

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  console.log("Seeding GameHub (large dataset)…");

  const adminHash = await bcrypt.hash(ADMIN.password, 10);
  const demoHash = await bcrypt.hash("password123", 10);

  // Fresh demo data every run: wipe plays, transactions, and non-admin users.
  await prisma.gamePlay.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({ where: { role: "USER" } });

  await prisma.user.upsert({
    where: { email: ADMIN.email },
    update: { name: ADMIN.name, role: "ADMIN", passwordHash: adminHash },
    create: { email: ADMIN.email, name: ADMIN.name, role: "ADMIN", passwordHash: adminHash },
  });

  // Build ~48 unique demo users.
  const N = 48;
  const seen = new Set();
  const userData = [];
  let n = 0;
  while (userData.length < N && n < 500) {
    n++;
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}.${userData.length}@example.com`;
    if (seen.has(email)) continue;
    seen.add(email);
    userData.push({ email, name, passwordHash: demoHash, role: "USER", createdAt: daysAgo(rand(0, 60)) });
  }
  await prisma.user.createMany({ data: userData, skipDuplicates: true });
  const users = await prisma.user.findMany({ where: { role: "USER" }, select: { id: true } });

  const txns = [];
  const plays = [];

  for (const u of users) {
    // 4–10 approved deposits, mostly large.
    const nDep = rand(4, 10);
    for (let i = 0; i < nDep; i++) {
      txns.push({
        userId: u.id,
        kind: "DEPOSIT",
        method: pick(METHODS),
        amount: money(150, 6000),
        status: "APPROVED",
        createdAt: daysAgo(rand(0, 45)),
      });
    }
    // some deposits landed in the last 14 days for the trend chart
    for (let i = 0; i < rand(1, 4); i++) {
      txns.push({
        userId: u.id,
        kind: "DEPOSIT",
        method: pick(METHODS),
        amount: money(100, 3000),
        status: "APPROVED",
        createdAt: daysAgo(rand(0, 13)),
      });
    }
    // 0–4 approved payouts (smaller than deposits)
    for (let i = 0; i < rand(0, 4); i++) {
      txns.push({
        userId: u.id,
        kind: "PAYOUT",
        method: pick(METHODS),
        amount: money(50, 1500),
        status: "APPROVED",
        createdAt: daysAgo(rand(0, 20)),
      });
    }
    // 0–2 pending requests to review
    for (let i = 0; i < rand(0, 2); i++) {
      txns.push({
        userId: u.id,
        kind: Math.random() < 0.5 ? "DEPOSIT" : "PAYOUT",
        method: pick(METHODS),
        amount: money(80, 2500),
        status: "PENDING",
        createdAt: daysAgo(rand(0, 3)),
      });
    }
    // occasional declined
    if (Math.random() < 0.25) {
      txns.push({
        userId: u.id,
        kind: "PAYOUT",
        method: pick(METHODS),
        amount: money(100, 2000),
        status: "DECLINED",
        createdAt: daysAgo(rand(0, 30)),
      });
    }
    // 3–15 game plays
    const nPlay = rand(3, 15);
    for (let i = 0; i < nPlay; i++) {
      plays.push({ userId: u.id, gameSlug: pick(GAMES), createdAt: daysAgo(rand(0, 30)) });
    }
  }

  for (const c of chunk(txns, 1000)) await prisma.transaction.createMany({ data: c });
  for (const c of chunk(plays, 1000)) await prisma.gamePlay.createMany({ data: c });

  const [uCount, tCount, gCount, inAgg, outAgg] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.gamePlay.count(),
    prisma.transaction.aggregate({ _sum: { amount: true }, where: { kind: "DEPOSIT", status: "APPROVED" } }),
    prisma.transaction.aggregate({ _sum: { amount: true }, where: { kind: "PAYOUT", status: "APPROVED" } }),
  ]);
  const totalIn = Number(inAgg._sum.amount ?? 0);
  const totalOut = Number(outAgg._sum.amount ?? 0);
  console.log(`Done. Users: ${uCount}, Transactions: ${tCount}, Game plays: ${gCount}`);
  console.log(`Total in: $${totalIn.toLocaleString()}, Total out: $${totalOut.toLocaleString()}, Held: $${(totalIn - totalOut).toLocaleString()}`);
  console.log(`Admin login: ${ADMIN.email} / ${ADMIN.password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
