import Link from "next/link";

import { V1Shell } from "@/components/v1/v1-shell";

export const metadata = { title: "Privacy Policy — ServeLocal" };

export default function PrivacyPage() {
  return (
    <V1Shell>
      <div className="section" style={{ maxWidth: 760 }}>
        <div className="sec-tag">Legal</div>
        <h2 className="sec-title" style={{ marginBottom: 6 }}>Privacy Policy</h2>
        <p className="sec-sub" style={{ marginBottom: 28 }}>Last updated: June 29, 2026</p>

        <div className="legal-body">
          <p>ServeLocal connects students with community volunteer opportunities. It is free forever for students. This policy explains what we collect, why, and the choices you have. We collect the minimum needed to run the service and we never sell your data.</p>

          <h3>Information we collect</h3>
          <ul>
            <li><strong>Account details.</strong> Students: name, email, date of birth, and (optionally) school, grade, and location. Organizations: organization name, contact email, website, and EIN.</li>
            <li><strong>Activity.</strong> Opportunities you create or apply to, verified volunteer hours, awards, reviews, endorsements, and messages you send through the platform.</li>
            <li><strong>Approximate location (optional).</strong> If you enter a ZIP code or tap “Use my location,” we use it to estimate distances to opportunities. Device-location coordinates are rounded to about 1&nbsp;km before they leave your browser and are <strong>not stored</strong>.</li>
            <li><strong>Donations.</strong> Supporter contributions (currently in demo mode — no real card data is collected until payments are enabled).</li>
          </ul>

          <h3>Cookies &amp; local storage</h3>
          <p>We do <strong>not</strong> use tracking cookies, advertising, or third-party analytics. The site stores a few <strong>functional</strong> items in your browser’s <code>localStorage</code>: your sign-in token (to keep you logged in) and small preferences (calendar-sync toggle, onboarding dismissal). You can clear these any time by logging out or clearing site data.</p>

          <h3>How we use your information</h3>
          <p>To operate the platform: authenticate you, match you to opportunities, track and verify hours, recognize awards, enable organizations to manage applicants, and keep the service secure. We do not use your data for advertising.</p>

          <h3>How information is shared</h3>
          <ul>
            <li>Organizations you apply to can see the application details relevant to that opportunity.</li>
            <li>The public leaderboard shows only your <strong>first name and last initial</strong>.</li>
            <li>We never sell or rent personal data. We share with service providers only as needed to run the service (e.g., email delivery), under confidentiality obligations.</li>
          </ul>

          <h3>Your choices &amp; rights</h3>
          <ul>
            <li><strong>Access &amp; export.</strong> Download a copy of your data from your profile (“Export my data”).</li>
            <li><strong>Correct.</strong> Update your details any time in your profile.</li>
            <li><strong>Delete.</strong> Permanently delete your account and associated personal data from your profile (“Delete account”).</li>
          </ul>

          <h3>Data retention &amp; security</h3>
          <p>We keep your data while your account is active and delete it on request. Passwords are stored using a strong one-way hash (scrypt) — never in plain text — and traffic is encrypted in transit (HTTPS). No system is perfectly secure, but we follow industry practices to protect your information.</p>

          <h3>Students &amp; minors</h3>
          <p>ServeLocal is used by students who may be minors. We collect only what’s needed to provide volunteer matching and hour tracking. If you believe a child has provided information without appropriate consent, contact us and we will remove it.</p>

          <h3>Changes &amp; contact</h3>
          <p>We may update this policy; material changes will be reflected by the “last updated” date above. Questions or requests: <a href="mailto:privacy@servelocal.org">privacy@servelocal.org</a>. See also our <Link href="/terms">Terms of Service</Link>.</p>
        </div>
      </div>
    </V1Shell>
  );
}
