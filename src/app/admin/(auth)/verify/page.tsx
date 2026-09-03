export const metadata = {
  title: "Verify | Sociolab",
  robots: { index: false, follow: false },
};

import { VerifyForm } from "./verify-form";

export default function VerifyPage() {
  return (
    <div className="w-full max-w-md px-5">
      <div className="mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-lg bg-brand text-ink flex items-center justify-center font-display font-bold text-lg">
          S
        </span>
        <span className="font-display text-xl font-semibold">Sociolab</span>
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        Two-step verification
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Enter the 6-digit code from your authenticator app, or a recovery code.
      </p>
      <VerifyForm />
    </div>
  );
}
