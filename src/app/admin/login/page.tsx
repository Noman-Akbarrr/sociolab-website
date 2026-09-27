import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign In | Sociolab CRM",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
