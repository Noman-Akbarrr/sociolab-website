"use client";

import { useSearchParams } from "next/navigation";

export type Phase = "pending" | "success" | "error";

/* SVG path lengths (circumference / polyline length) so the draw-on
   animations can animate stroke-dashoffset to zero. */
const RING_LEN = 277; // circle r=44
const MARK_LEN = 46; // checkmark polyline
const X_LEN = 30; // one stroke of the cross

const COPY: Record<Phase, { eyebrow: string; headline: string; sub: string }> = {
  pending: {
    eyebrow: "Connecting",
    headline: "Connecting your TikTok…",
    sub: "Hold on while we confirm the connection.",
  },
  success: {
    eyebrow: "TikTok connected",
    headline: "You're all set.",
    sub: "Sociolab can now manage this TikTok account. You can close this window and head back to the app.",
  },
  error: {
    eyebrow: "Connection failed",
    headline: "That didn't go through.",
    sub: "We didn't get permission for your TikTok account. Close this window and start the connection again.",
  },
};

/**
 * Resolved view: TikTok redirects here with either `code` (granted) or
 * `error`/`error_description` (denied or failed). No params at all is
 * treated as an error — the only way to reach this page is a redirect
 * that carries one of the two.
 */
export function CallbackStatus() {
  const params = useSearchParams();
  const phase: Phase = params.get("code") ? "success" : "error";
  return <CallbackView phase={phase} errorCode={params.get("error")} />;
}

/** Suspense fallback: the same screen mid-connection. */
export function CallbackPending() {
  return <CallbackView phase="pending" errorCode={null} />;
}

function CallbackView({ phase, errorCode }: { phase: Phase; errorCode: string | null }) {
  const done = phase !== "pending";
  const copy = COPY[phase];
  const accent = phase === "error" ? "#F87171" : "#FF5500";

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "#090D16" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 38%, rgba(255, 85, 0, 0.10), transparent 70%)",
        }}
      />

      <svg
        aria-hidden="true"
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        className={phase === "pending" ? "tt-spin" : undefined}
      >
        <circle
          cx="48"
          cy="48"
          r="44"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          className={done ? "tt-ring-done" : undefined}
          style={{
            strokeDasharray: RING_LEN,
            strokeDashoffset: done ? 0 : RING_LEN / 2,
          }}
        />
        {phase === "success" && (
          <path
            d="M32 50 L44 62 L65 39"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="tt-mark"
            style={{ strokeDasharray: MARK_LEN }}
          />
        )}
        {phase === "error" && (
          <>
            <line
              x1="38"
              y1="38"
              x2="58"
              y2="58"
              stroke={accent}
              strokeWidth="4"
              strokeLinecap="round"
              className="tt-x"
              style={{ strokeDasharray: X_LEN }}
            />
            <line
              x1="58"
              y1="38"
              x2="38"
              y2="58"
              stroke={accent}
              strokeWidth="4"
              strokeLinecap="round"
              className="tt-x tt-x--2"
              style={{ strokeDasharray: X_LEN }}
            />
          </>
        )}
      </svg>

      <p
        className={`mt-8 font-mono text-xs font-semibold uppercase tracking-[0.22em] ${
          done ? "tt-rise tt-d1" : ""
        }`}
        style={{ color: accent }}
      >
        {copy.eyebrow}
      </p>
      <h1
        className={`mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl ${
          done ? "tt-rise tt-d2" : ""
        }`}
        style={{ color: "#FFFFFF" }}
      >
        {copy.headline}
      </h1>
      <p
        className={`mt-4 max-w-sm text-sm leading-relaxed sm:text-base ${
          done ? "tt-rise tt-d3" : ""
        }`}
        style={{ color: "#94A3B8" }}
      >
        {copy.sub}
      </p>

      {errorCode && (
        <p
          className={`mt-6 font-mono text-[11px] uppercase tracking-[0.16em] ${
            done ? "tt-rise tt-d3" : ""
          }`}
          style={{ color: "#64748B" }}
        >
          TikTok error: {errorCode}
        </p>
      )}
    </div>
  );
}
