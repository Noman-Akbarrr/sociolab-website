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
    <div className="w-full max-w-md px-5">
      <div className="mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-lg bg-brand text-ink flex items-center justify-center font-display font-bold text-lg">
          S
        </span>
        <span className="font-display text-xl font-semibold">Sociolab</span>
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink/60">
        Internal team access only.
      </p>

      {configured ? (
        <LoginForm />
      ) : (
        <div className="mt-8 rounded-[3px] border border-line bg-white p-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-brand">
            No admin yet
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Create the first admin before signing in.
          </p>
        </div>
      )}
    </div>
  );
}
