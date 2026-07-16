"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { TurnstileWidget } from "@/components/turnstile-widget";
import { V1Shell } from "@/components/v1/v1-shell";
import { ApiError, useAuth } from "@/lib/auth-context";

function ageFromDob(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<"student" | "org">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const age = ageFromDob(dob);
  const isMinor = role === "student" && age !== null && age < 18;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({
        email,
        password,
        full_name: fullName || undefined,
        role,
        ...(role === "student" ? { dob } : {}),
        ...(isMinor ? { guardian_name: guardianName, guardian_email: guardianEmail } : {}),
        ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <V1Shell>
      <div className="auth-wrap">
        <div className="modal-card">
          <div className="mhdr">
            <div className="mtitle">Welcome to ServeLocal</div>
            <div className="msub">Connecting students with meaningful service</div>
          </div>
          <div className="mbody">
            <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: 16 }}>I am signing up as a…</p>
            <div className="auth-role-btns">
              <div className={`role-btn${role === "student" ? " on" : ""}`} onClick={() => setRole("student")}>
                <div className="rb-icon">🎓</div>
                <div className="rb-label">Student</div>
                <div className="rb-sub">Find volunteer opportunities</div>
              </div>
              <div className={`role-btn${role === "org" ? " on" : ""}`} onClick={() => setRole("org")}>
                <div className="rb-icon">🏛️</div>
                <div className="rb-label">Organization</div>
                <div className="rb-sub">Post opportunities &amp; verify hours</div>
              </div>
            </div>

            <form onSubmit={onSubmit}>
              {error && <div className="ferr" style={{ display: "block" }}>{error}</div>}
              <div className="fr">
                <label>{role === "org" ? "Organization Name" : "Full Name (legal)"} <span style={{ color: "var(--red)" }}>*</span></label>
                <input className="fc" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={role === "org" ? "Green Roots Community Garden" : "Alex Johnson"} />
              </div>
              <div className="fr">
                <label>Email <span style={{ color: "var(--red)" }}>*</span></label>
                <input className="fc" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="fr">
                <label>Password <span style={{ color: "var(--red)" }}>*</span></label>
                <input className="fc" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
              </div>
              {role === "student" && (
                <div className="fr">
                  <label>Date of Birth <span style={{ color: "var(--red)" }}>*</span></label>
                  <input className="fc" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
                  <div className="fhint">Must be 12 or older. Required for award tracking.</div>
                </div>
              )}
              {isMinor && (
                <div style={{ background: "var(--green-pale)", border: "1px solid var(--green-mid)", borderRadius: 9, padding: 14, marginBottom: 4 }}>
                  <div className="fr">
                    <label>Parent/Guardian Name <span style={{ color: "var(--red)" }}>*</span></label>
                    <input className="fc" required value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Jamie Johnson" />
                  </div>
                  <div className="fr" style={{ marginBottom: 0 }}>
                    <label>Parent/Guardian Email <span style={{ color: "var(--red)" }}>*</span></label>
                    <input className="fc" type="email" required value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} placeholder="parent@example.com" />
                    <div className="fhint">Since you&apos;re under 18, we&apos;ll email your parent/guardian to approve your account before you can sign up for opportunities.</div>
                  </div>
                </div>
              )}
              <TurnstileWidget onToken={setTurnstileToken} />
              <button className="fsubmit" style={{ width: "100%" }} type="submit" disabled={submitting}>
                {submitting ? "Creating account…" : role === "org" ? "Register Organization" : "Create Student Account"}
              </button>
              <p style={{ fontSize: ".76rem", color: "var(--muted)", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
                By signing up you agree to our{" "}
                <Link href="/terms" style={{ color: "var(--green)", fontWeight: 600 }}>Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" style={{ color: "var(--green)", fontWeight: 600 }}>Privacy Policy</Link>.
              </p>
            </form>
            <p style={{ fontSize: ".8rem", color: "var(--muted)", textAlign: "center", marginTop: 14 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--green)", fontWeight: 600 }}>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </V1Shell>
  );
}
