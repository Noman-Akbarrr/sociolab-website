import { Suspense } from "react";
import { CallbackPending, CallbackStatus } from "./callback-status";

export const metadata = {
  title: "Connecting TikTok | Sociolab",
  robots: { index: false, follow: false },
};

export default function TikTokCallbackPage() {
  return (
    <Suspense fallback={<CallbackPending />}>
      <CallbackStatus />
    </Suspense>
  );
}
