export const metadata = {
  title: "Verify | Sociolab",
  robots: { index: false, follow: false },
};

import { VerifyForm } from "./verify-form";

export default function VerifyPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-md flex-col justify-center px-5 py-16">
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