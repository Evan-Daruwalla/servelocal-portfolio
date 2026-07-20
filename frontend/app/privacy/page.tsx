import Link from "next/link";

import { V1Shell } from "@/components/v1/v1-shell";

export const metadata = { title: "Privacy Policy — ServeLocal" };

const draftBanner = {
  background: "var(--gold-pale)",
  border: "2px solid var(--gold)",
  borderRadius: 8,
  padding: "14px 18px",
  marginBottom: 28,
  color: "var(--dark)",
  fontSize: ".9rem",
  lineHeight: 1.6,
} as const;

export default function PrivacyPage() {
  return (
    <V1Shell>
      <div className="section" style={{ maxWidth: 760 }}>
        <div className="sec-tag">Legal</div>
        <h2 className="sec-title" style={{ marginBottom: 6 }}>Privacy Policy</h2>
        <p className="sec-sub" style={{ marginBottom: 20 }}>Draft dated: July 16, 2026</p>

        <div style={draftBanner} role="note">
          <strong style={{ display: "block", fontSize: ".95rem", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".03em" }}>
            Draft: pending legal review and sign-off
          </strong>
          This document is a working draft. It has <strong>not</strong> been reviewed by counsel and is
          <strong> not yet in effect</strong>. Draft dated July 16, 2026.
        </div>

        <div className="legal-body">
          <p>ServeLocal connects students with community-service opportunities and is <strong>free forever for students</strong>. This policy explains what we collect, why, who can see it, and the choices you have. We collect the minimum needed to run the service, we do not use advertising or third-party analytics, and <strong>we never sell your data</strong>.</p>

          <h3>What we collect</h3>
          <ul>
            <li><strong>Account details.</strong> Students provide a name, email, password, and <strong>date of birth</strong> (used to enforce the minimum age and the guardian-consent and award rules; see below). Organizations provide an organization name, contact email, and organization details such as a website or EIN.</li>
            <li><strong>Guardian details (minors only).</strong> If you are a student under 18, we collect your parent or guardian&rsquo;s <strong>name and email</strong> so we can request their consent. We also record the date/time, IP address, and browser of a guardian&rsquo;s consent decision as proof of consent.</li>
            <li><strong>Activity.</strong> Opportunities you create or apply to, applications, verified volunteer hours, awards, reviews, endorsements, saved opportunities, in-app notifications, and messages you send through the platform.</li>
            <li><strong>Approximate location (optional).</strong> If you enter a ZIP code or choose &ldquo;use my location,&rdquo; we use it to estimate distances to opportunities. Precise device coordinates are rounded in your browser and are <strong>not stored</strong>.</li>
            <li><strong>What we do <em>not</em> collect.</strong> No advertising or tracking identifiers, no third-party analytics, and <strong>no cookies</strong>. Payment card details for organization subscriptions are handled by our payment processor (Stripe) and never touch our servers.</li>
          </ul>

          <h3>Sign-in mechanism (no cookies)</h3>
          <p>ServeLocal does <strong>not</strong> use cookies. When you log in, your browser stores a sign-in token in <code>localStorage</code>, which is sent with your requests to keep you logged in; a small number of interface preferences may also be stored there. Nothing in <code>localStorage</code> is used for tracking or advertising. You can clear it any time by logging out or clearing your browser&rsquo;s site data.</p>

          <h3>Why we use it</h3>
          <ul>
            <li><strong>Run your account</strong>: authenticate you (sign-in token), and let you manage your profile.</li>
            <li><strong>Match &amp; apply</strong>: show relevant opportunities and let you apply; the date of birth drives age-based award tracking and the consent gate.</li>
            <li><strong>Verify service</strong>: record hours and let organizations verify them, and recognize awards for verified hours.</li>
            <li><strong>Communicate</strong>: send in-app notifications, guardian-consent requests, and transactional emails (see Email, below).</li>
            <li><strong>Keep it safe</strong>: bot protection, rate limiting, and an append-only audit log of security-relevant actions (logins, consent decisions, deletions).</li>
          </ul>

          <h3>Who sees what</h3>
          <ul>
            <li><strong>Organizations you apply to</strong> see the details relevant to your application (including your name and email) only <strong>after you apply</strong> to one of their opportunities. This is scoped to that organization.</li>
            <li><strong>Public surfaces minimize minor names.</strong> The public leaderboard and any public service portfolio show a minor&rsquo;s name as <strong>first name and last initial only</strong>.</li>
            <li><strong>Your service portfolio is private by default</strong> and public only if you opt in; for a student under 18, making it public requires verified guardian consent. A private or unknown portfolio link returns a generic &ldquo;not found&rdquo; and never reveals whether an account exists.</li>
            <li><strong>Service providers.</strong> We share data with vendors only as needed to run the service, for example, email delivery (Resend) and payment processing for organization subscriptions (Stripe), under confidentiality obligations. We never sell or rent personal data.</li>
          </ul>

          <h3>Guardian rights</h3>
          <p>When a student under 18 signs up, we email the listed guardian a link to <strong>approve or decline</strong> the account. If approved, the guardian receives a separate long-lived link that lets them <strong>revoke consent at any time</strong>; revoking immediately re-blocks the student from applying, messaging, checking in, or making a portfolio public. Guardians who have questions or want a student&rsquo;s data removed can contact us at <a href="mailto:[CONTACT EMAIL — Evan]">[CONTACT EMAIL — Evan]</a>.</p>

          <h3>Your rights &amp; choices</h3>
          <ul>
            <li><strong>Access &amp; export.</strong> Download a JSON copy of your data (profile, applications, hours, messages, reviews, and notifications) from the <strong>Account</strong> section of your dashboard (&ldquo;Download my data&rdquo;). The export excludes internal security fields such as your password hash and consent-decision IP.</li>
            <li><strong>Correct.</strong> Update your details any time in your account.</li>
            <li><strong>Delete.</strong> Permanently delete your account from the <strong>Account</strong> section of your dashboard (password required). This removes your personal data and deactivates your account. <strong>Honest caveat:</strong> so that an organization&rsquo;s record of already-verified service survives, your applications and verified-hours history are <strong>kept in anonymized form with your name and identifying details removed</strong>, and entries in the append-only security audit log are retained. Organizations must deactivate active listings before deleting.</li>
          </ul>

          <h3>Email</h3>
          <p>We send <strong>transactional email only</strong>: things like application updates, hour verifications, guardian-consent requests, and password resets. There is no marketing email. You can turn off non-essential notification emails with the email-notifications toggle in your account settings; security and consent-critical messages may still be sent.</p>

          <h3>Data retention &amp; security</h3>
          <p>We keep your data while your account is active and remove personal data when you delete your account, subject to the anonymized-service-record caveat above. Passwords are stored using a strong one-way hash (Argon2), never in plain text, and traffic is encrypted in transit (HTTPS). No system is perfectly secure, but we follow industry practices to protect your information.</p>

          <h3>Children&rsquo;s privacy</h3>
          <p>ServeLocal is used by students who may be minors, and we build for that. Students under <strong>12</strong> are not permitted to register. Students aged 12&ndash;17 may create an account, but a <strong>parent or guardian must verify consent before the student takes any real-world-contact action</strong>: applying, messaging, checking in, or making a portfolio public. We collect only what&rsquo;s needed for volunteer matching and hour tracking, and we minimize minors&rsquo; names on all public surfaces. If you believe a child under our minimum age has provided information, or a minor is using the service without appropriate guardian consent, contact us at <a href="mailto:[CONTACT EMAIL — Evan]">[CONTACT EMAIL — Evan]</a> and we will address it.</p>

          <h3>Your regional rights (CCPA / GDPR)</h3>
          <p>Depending on where you live, you may have rights to <strong>access</strong> the personal data we hold about you, request its <strong>deletion</strong>, and obtain a <strong>portable copy</strong>. ServeLocal supports all three directly: access and portability through the data export, and deletion through account deletion, both in your dashboard&rsquo;s Account section. We do not sell personal information or use it for targeted advertising. To exercise a right you can&rsquo;t complete in-app, or to ask a question, contact us at <a href="mailto:[CONTACT EMAIL — Evan]">[CONTACT EMAIL — Evan]</a>.</p>

          <h3>Changes &amp; contact</h3>
          <p>We may update this policy; material changes will be reflected by the date at the top. Questions or requests: <a href="mailto:[CONTACT EMAIL — Evan]">[CONTACT EMAIL — Evan]</a>. See also our <Link href="/terms">Terms of Service</Link>.</p>
        </div>
      </div>
    </V1Shell>
  );
}
