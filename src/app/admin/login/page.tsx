import { listUsers } from "@/lib/auth/users";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in | Sociolab",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const users = await listUsers();
  const configured = users.length > 0;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink/60">
        Internal team access only. Authorized personnel only.
      </p>

      {configured ? (
        <LoginForm />
      ) : (
        <div className="mt-8 rounded-[3px] border border-line bg-white p-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
            No admin yet
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Create the first admin before signing in:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-[3px] bg-ink p-4 font-mono text-xs text-white">
            {`node scripts/create-admin.mjs`}
          </pre>
        </div>
      )}
    </div>
  );
}