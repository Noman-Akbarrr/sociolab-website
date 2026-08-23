"use client";

import { useState } from "react";

type SetupState = "idle" | "qr" | "codes";

export function TwoFactorSetup() {
  const [state, setState] = useState<SetupState>("idle");
  const [qr, setQr] = useState("");
  const [otpauth, setOtpauth] = useState("");
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function start() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const data = await res.json();
      if (res.ok) {
        setQr(data.qr);
        setOtpauth(data.otpauth);
        setState("qr");
      } else {
        setError(data.error ?? "Couldn't start setup.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function confirm() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm", code }),
      });
      const data = await res.json();
      if (res.ok) {
        setCodes(data.recoveryCodes);
        setState("codes");
      } else {
        setError(data.error ?? "That code isn't valid.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (state === "qr") {
    return (
      <div className="mt-8 rounded-[3px] border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Enable two-factor auth</h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/70">
          Scan this QR with your authenticator app (Google Authenticator, Authy, or similar). Can&apos;t
          scan? Use the manual code below.
        </p>
        <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR code for authenticator" width={180} height={180} className="rounded-[3px] border border-line" />
          ) : null}
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
              Manual setup
            </p>
            <code className="break-all rounded-[3px] bg-mist px-3 py-2 font-mono text-xs text-ink">
              {otpauth}
            </code>
          </div>
        </div>
        <div className="mt-6 flex max-w-sm flex-col gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            inputMode="numeric"
            className="w-full rounded-[3px] border border-line bg-white px-4 py-3 font-mono text-sm tracking-widest text-ink outline-none focus:border-brand"
          />
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          <button
            type="button"
            onClick={confirm}
            disabled={loading || code.length === 0}
            className="rounded-[3px] bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Checking…" : "Verify & enable"}
          </button>
        </div>
      </div>
    );
  }

  if (state === "codes") {
    return (
      <div className="mt-8 rounded-[3px] border-2 border-brand bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Save these recovery codes</h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/70">
          Two-factor is now on. These 10 one-time codes are your backup if you lose your phone —
          store them somewhere safe. Each code works once.
        </p>
        <div className="mt-4 grid max-w-md grid-cols-2 gap-2">
          {codes.map((c) => (
            <code key={c} className="rounded-[3px] bg-mist px-3 py-2 text-center font-mono text-sm text-ink">
              {c}
            </code>
          ))}
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-[3px] bg-ink px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand"
        >
          I&apos;ve saved them — done
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 rounded-[3px] border border-line bg-white p-6">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Two-factor authentication is off</h2>
        <p className="mt-1 text-sm text-ink/70">
          Recommended before you invite anyone else. Takes 30 seconds.
        </p>
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="w-fit rounded-[3px] bg-ink px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand disabled:opacity-60"
      >
        {loading ? "Preparing…" : "Enable two-factor"}
      </button>
    </div>
  );
}