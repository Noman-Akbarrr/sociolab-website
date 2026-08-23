import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const AUTH_FILE = path.join(process.cwd(), ".puck", "auth.json");

function readAuthFile() {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    }
  } catch {}
  return { users: [] };
}

function writeAuthFile(db) {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function validatePassword(password) {
  if (password.length < 10) return "at least 10 characters";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "upper and lower case letters and a number";
  }
  return null;
}

async function main() {
  const rl = createInterface({ input, output });

  if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL is set — this script targets the file store only.");
    console.log("For a Postgres-backed admin, set the admin up in production via the bootstrap route.");
    rl.close();
    process.exit(1);
  }

  console.log("Create the first Sociolab admin.\n");

  const name = (await rl.question("Name: ")).trim();
  const email = (await rl.question("Email: ")).trim().toLowerCase();
  const password = await rl.question("Password: ", { hideEchoBack: true });

  const db = readAuthFile();
  if (db.users.some((u) => u.email === email)) {
    console.log(`\nA user with email ${email} already exists.`);
    rl.close();
    process.exit(1);
  }

  const problem = validatePassword(password);
  if (problem) {
    console.log(`\nPassword needs ${problem}.`);
    rl.close();
    process.exit(1);
  }

  const user = {
    id: randomUUID(),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
    isTwoFactorEnabled: false,
    twoFactorSecret: null,
    recoveryCodes: [],
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeAuthFile(db);

  console.log(`\nAdmin created for ${email}.`);
  console.log("Next: sign in at /admin and enable two-factor auth from the dashboard.");
  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});