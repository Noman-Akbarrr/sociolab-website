export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | Sociolab",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist flex items-center justify-center">
      {children}
    </div>
  );
}
