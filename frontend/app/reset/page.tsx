"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

import { V1Shell } from "@/components/v1/v1-shell";
import { ApiError, api } from "@/lib/api";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return <div className="ferr" style={{ display: "block" }}>This reset link is missing its token. Request a new one.</div>;
  }
  if (done) {
    return (
      <div>
        <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: 14 }}>Your password has been reset.</p>
        <button className="fsubmit" style={{ width: "100%" }} onClick={() => router.push("/login")}>Go to log in</button>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit}>
      {error && <div className="ferr" style={{ display: "block" }}>{error}</div>}
      <div className="fr">
        <label>New password</label>
        <input className="fc" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
      </div>
      <div className="fr">
        <label>Confirm new password</label>
        <input className="fc" type="password" required value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Repeat it" />
      </div>
      <button className="fsubmit" style={{ width: "100%" }} type="submit" disabled={submitting}>
        {submitting ? "Resetting…" : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <V1Shell>
      <div className="auth-wrap">
        <div className="modal-card">
          <div className="mhdr">
            <div className="mtitle">Set a new password</div>
            <div className="msub">Choose a new password for your account</div>
          </div>
          <div className="mbody">
            <Suspense fallback={<p style={{ fontSize: ".85rem", color: "var(--muted)" }}>Loading…</p>}>
              <ResetForm />
            </Suspense>
            <p style={{ fontSize: ".8rem", color: "var(--muted)", textAlign: "center", marginTop: 14 }}>
              <Link href="/login" style={{ color: "var(--green)", fontWeight: 600 }}>← Back to log in</Link>
            </p>
          </div>
        </div>
      </div>
    </V1Shell>
  );
}
