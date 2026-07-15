import Link from "next/link";

import { V1Shell } from "@/components/v1/v1-shell";

export const metadata = { title: "Terms of Service — ServeLocal" };

export default function TermsPage() {
  return (
    <V1Shell>
      <div className="section" style={{ maxWidth: 760 }}>
        <div className="sec-tag">Legal</div>
        <h2 className="sec-title" style={{ marginBottom: 6 }}>Terms of Service</h2>
        <p className="sec-sub" style={{ marginBottom: 28 }}>Last updated: June 29, 2026</p>

        <div className="legal-body">
          <p>Welcome to ServeLocal. By creating an account or using the platform, you agree to these Terms. ServeLocal connects students with community volunteer opportunities and is free forever for students. If you don’t agree with these Terms, please don’t use the service.</p>

          <h3>Eligibility &amp; accounts</h3>
          <ul>
            <li>Students who are minors should have a parent or guardian review these Terms. Organizations must represent a legitimate group and provide accurate details.</li>
            <li>You’re responsible for keeping your password secure and for activity under your account. Provide accurate information and keep it up to date.</li>
            <li>One person or organization per account; don’t impersonate others.</li>
          </ul>

          <h3>Acceptable use</h3>
          <p>To keep ServeLocal safe and trustworthy, you agree not to:</p>
          <ul>
            <li>Log, claim, or verify volunteer hours that weren’t actually performed.</li>
            <li>Post false, misleading, unsafe, or illegal listings or content.</li>
            <li>Harass, abuse, or endanger other users; collect others’ data; or contact users for purposes unrelated to volunteering.</li>
            <li>Scrape, overload, probe, or attempt to break the security of the service.</li>
          </ul>

          <h3>Volunteer hours &amp; awards</h3>
          <p>Hours are submitted by students and <strong>verified by organizations</strong>; awards are based on verified hours. ServeLocal provides the tools but does not independently guarantee the accuracy of hours or the conduct of any organization or volunteer. Verify details directly and use your judgment about safety before attending.</p>

          <h3>Organizations</h3>
          <p>Organizations are responsible for the accuracy of their listings, for honoring posted commitments, for verifying hours fairly, and for complying with applicable laws (including any background-check or supervision requirements for working with minors).</p>

          <h3>Your content</h3>
          <p>You keep ownership of the content you submit (profiles, listings, reviews, messages). You grant ServeLocal a limited license to host and display that content to operate the service. We may remove content that violates these Terms.</p>

          <h3>Donations</h3>
          <p>Supporter donations are voluntary and help keep the platform free for students. Donations are currently in demo mode; no real payments are processed until billing is enabled.</p>

          <h3>Disclaimers &amp; limitation of liability</h3>
          <p>The service is provided “as is,” without warranties of any kind. ServeLocal does not vet every organization, opportunity, or user, and is not responsible for interactions that occur offline. To the maximum extent permitted by law, ServeLocal is not liable for indirect or incidental damages arising from your use of the service.</p>

          <h3>Suspension &amp; termination</h3>
          <p>We may suspend or remove accounts that violate these Terms or put others at risk. You can delete your account at any time from your profile.</p>

          <h3>Changes &amp; contact</h3>
          <p>We may update these Terms; material changes will be reflected by the “last updated” date above. Continued use after changes means you accept the updated Terms. Questions: <a href="mailto:support@servelocal.org">support@servelocal.org</a>. See also our <Link href="/privacy">Privacy Policy</Link>.</p>
        </div>
      </div>
    </V1Shell>
  );
}
