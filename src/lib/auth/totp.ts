import { generateSecret as otplibGenerateSecret, generateURI, verifySync } from "otplib";

export function generateSecret(): string {
  return otplibGenerateSecret();
}

export function verifyTotp(secret: string, token: string): boolean {
  const result = verifySync({ secret, token, epochTolerance: 30 });
  return result.valid;
}

export function otpauthUrl(secret: string, email: string): string {
  return generateURI({ issuer: "Sociolab", label: email, secret });
}