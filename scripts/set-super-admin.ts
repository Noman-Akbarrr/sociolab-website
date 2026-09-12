import { PrismaClient } from "./src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  console.log("Current users:");
  console.log(JSON.stringify(users, null, 2));

  if (users.length === 0) {
    console.log("\nNo users found. Creating super admin...");
    const user = await prisma.user.create({
      data: {
        name: "Noman",
        email: "noman@sociolab.co",
        passwordHash: "$2a$12$LJ3m4ys3Lk0TSwMCPNEPluAINoB6YR4.uIxnfCaBlWDQJKR3MOufu",
        role: "super_admin",
      },
    });
    console.log("Created super admin:", user.email);
  } else {
    const updated = await prisma.user.update({
      where: { id: users[0].id },
      data: { role: "super_admin" },
    });
    console.log(`\nUpdated ${updated.email} to super_admin`);
  }

  const finalUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  console.log("\nFinal users:");
  console.log(JSON.stringify(finalUsers, null, 2));

  await prisma.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
