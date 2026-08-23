import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateRecoveryCodes(count = 10): { codes: string[]; hashes: string[] } {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const group = crypto.randomBytes(5).toString("hex").toUpperCase().slice(0, 4);
    codes.push(`${group}-${group}`);
  }
  return { codes, hashes: codes.map((code) => bcrypt.hashSync(code, 10)) };
}

export async function consumeRecoveryCode(
  hashes: string[],
  input: string,
): Promise<{ valid: boolean; remaining: string[] }> {
  const normalized = input.trim().toUpperCase();
  for (let i = 0; i < hashes.length; i++) {
    if (await bcrypt.compare(normalized, hashes[i])) {
      const remaining = [...hashes];
      remaining.splice(i, 1);
      return { valid: true, remaining };
    }
  }
  return { valid: false, remaining: hashes };
}