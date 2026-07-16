import Link from "next/link";

import { V1Shell } from "@/components/v1/v1-shell";

export const metadata = { title: "Terms of Service — ServeLocal" };

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

export default function TermsPage() {
  return (
    <V1Shell>
      <div className="section" style={{ maxWidth: 760 }}>
        <div className="sec-tag">Legal</div>
        <h2 className="sec-title" style={{ marginBottom: 6 }}>Terms of Service</h2>
        <p className="sec-sub" style={{ marginBottom: 20 }}>Draft dated: July 16, 2026</p>

        <div style={draftBanner} role="note">
          <strong style={{ display: "block", fontSize: ".95rem", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".03em" }}>
            Draft — pending legal review and sign-off
          </strong>
          This document is a working draft. It has <strong>not</strong> been reviewed by counsel and is
          <strong> not yet in effect</strong>. It does not create binding obligations until published in
          final form. Draft dated July 16, 2026.
        </div>

        <div className="legal-body">
          <p>Welcome to ServeLocal. ServeLocal is a platform that connects students with community-service and volunteer opportunities: students discover opportunities, apply, log hours that the hosting organization verifies, and earn awards for verified service; organizations post opportunities, review applicants, and verify attendance. ServeLocal is <strong>free forever for students</strong> — no feature that a student uses is ever gated behind a payment. By creating an account or using the platform you agree to these Terms. If you don&rsquo;t agree, please don&rsquo;t use the service.</p>

          <h3>Accounts &amp; eligibility</h3>
          <ul>
            <li><strong>Minimum age.</strong> You must be at least <strong>12 years old</strong> to create a student account. Registration is blocked below that age, and every student account requires a date of birth, which we use to compute age for the consent and award rules below.</li>
            <li><strong>Minors and guardian consent.</strong> If you are a student <strong>under 18</strong>, you must provide a parent or guardian&rsquo;s name and email at sign-up, and that guardian must approve your account before you can take any real-world-contact action — applying to an opportunity, messaging, checking in, or making your service portfolio public. Until a guardian verifies consent (and if a guardian later revokes it), those actions are blocked. A student who turns 18 is no longer gated.</li>
            <li><strong>Organizations.</strong> Organization accounts must represent a legitimate group and provide accurate details. A ServeLocal administrator reviews organizations before their listings go live.</li>
            <li><strong>Account security.</strong> You are responsible for keeping your password secure and for activity under your account. Provide accurate information and keep it current. One person or organization per account; don&rsquo;t impersonate others.</li>
          </ul>

          <h3>Acceptable use</h3>
          <p>To keep ServeLocal safe and trustworthy, you agree not to:</p>
          <ul>
            <li>Log, claim, or verify volunteer hours that weren&rsquo;t actually performed.</li>
            <li>Post false, misleading, unsafe, or illegal listings or content.</li>
            <li>Harass, abuse, or endanger other users; collect others&rsquo; data; or contact users for purposes unrelated to volunteering.</li>
            <li>Scrape, overload, probe, or attempt to break the security of the service, or circumvent the bot protection, rate limits, or consent gates.</li>
          </ul>

          <h3>Volunteer hours &amp; awards</h3>
          <p>Hours are submitted by students and <strong>verified by the hosting organization</strong>; awards are based on verified hours. ServeLocal provides the tools but does not independently guarantee the accuracy of hours or the conduct of any organization or volunteer. Verify details directly and use your judgment about safety before attending an in-person activity. Organizations are responsible for the accuracy of their listings, for honoring posted commitments, for verifying hours fairly, and for complying with applicable laws — including any background-check or supervision requirements for working with minors.</p>

          <h3>Your content &amp; intellectual property</h3>
          <p>You keep ownership of the content you submit — your profile, listings, reviews, endorsements, and messages. By submitting content you grant ServeLocal a non-exclusive, worldwide, royalty-free license to host, store, reproduce, and display that content <strong>solely to operate and provide the service</strong> (for example, showing your review on an organization&rsquo;s page or your name on the public leaderboard). This license ends when you delete the content or your account, except for content already shared with others or retained in anonymized form as described in the Privacy Policy, and except as needed for backups, legal compliance, or an organization&rsquo;s record of verified service. ServeLocal&rsquo;s own name, logo, and software remain ours. We may remove content that violates these Terms.</p>

          <h3>Copyright &amp; other IP complaints</h3>
          <p>We respect intellectual-property rights and expect users to do the same. If you believe content on ServeLocal infringes your copyright or other IP rights, send a notice to <a href="mailto:[CONTACT EMAIL — Evan]">[CONTACT EMAIL — Evan]</a> that includes: (1) your contact information; (2) identification of the work you claim is infringed; (3) identification of the material you want removed and where it appears on the service; (4) a statement that you have a good-faith belief the use is not authorized; and (5) a statement, under penalty of perjury, that the notice is accurate and that you are the rights-holder or authorized to act for them. We will review and remove or disable access to infringing material in appropriate cases, and we may terminate the accounts of repeat infringers. If your content was removed and you believe that was a mistake, you may send a counter-notice to the same address.</p>

          <h3>Organization subscriptions &amp; billing</h3>
          <p><strong>Students never pay.</strong> Paid plans apply only to organizations. Organizations may use ServeLocal on the free Community plan or subscribe to a paid <strong>Pro</strong> plan; current plan features and prices are listed on the <Link href="/pricing">Pricing</Link> page. Pro is billed as a recurring <strong>monthly</strong> subscription through our payment processor, Stripe, and renews automatically each month until cancelled.</p>
          <ul>
            <li><strong>Fulfillment.</strong> Pro features (such as unlimited and featured listings, analytics, and roster export) activate <strong>immediately upon successful payment</strong> and remain available for the paid billing period.</li>
            <li><strong>Cancellation &amp; refunds.</strong> You can cancel Pro at any time. Cancellation takes effect at the <strong>end of the current billing period</strong>: your Pro features remain active until then, and your subscription does not renew for the next period. Payments already made for the current or past periods are <strong>non-refundable</strong>, and we do not provide prorated or partial refunds, except where required by law. <em>[Refund terms above are a proposed default — Evan to confirm before this document takes effect.]</em></li>
            <li><strong>Price &amp; tax changes.</strong> We may change subscription prices or features prospectively; we&rsquo;ll give notice before a change affects your next renewal. You are responsible for any applicable taxes.</li>
          </ul>

          <h3 style={{ textTransform: "uppercase" }}>Warranty disclaimer</h3>
          <p style={{ textTransform: "uppercase" }}>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. SERVELOCAL DOES NOT VET EVERY ORGANIZATION, OPPORTUNITY, OR USER, DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, AND IS NOT RESPONSIBLE FOR INTERACTIONS THAT OCCUR OFFLINE. YOU USE THE SERVICE AT YOUR OWN RISK.</p>

          <h3 style={{ textTransform: "uppercase" }}>Limitation of liability</h3>
          <p style={{ textTransform: "uppercase" }}>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SERVELOCAL AND ITS OPERATORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, DATA, GOODWILL, OR OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE. TO THE MAXIMUM EXTENT PERMITTED BY LAW, SERVELOCAL&rsquo;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNT YOU PAID TO SERVELOCAL IN THE TWELVE MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS. BECAUSE THE SERVICE IS FREE FOR STUDENTS, A STUDENT&rsquo;S FEES-PAID CAP IS ZERO. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU.</p>

          <h3>Suspension &amp; termination</h3>
          <p>We may suspend or remove accounts that violate these Terms or put others at risk. You can delete your account at any time from the <strong>Account</strong> section of your dashboard; deletion is handled as described in the <Link href="/privacy">Privacy Policy</Link> (personal data is removed, while an organization&rsquo;s record of already-verified hours is retained in anonymized form). Organizations must deactivate their active listings before deleting their account.</p>

          <h3>Changes to these Terms</h3>
          <p>We may update these Terms. Material changes will be reflected by the date at the top, and — once the service is live — meaningful changes will be communicated to account holders. Continued use after an update means you accept the updated Terms.</p>

          <h3>Governing law</h3>
          <p>These Terms are governed by the laws of the State of [GOVERNING STATE — Evan], without regard to its conflict-of-laws rules, and you agree to the exclusive jurisdiction of the state and federal courts located there for any dispute that isn&rsquo;t subject to another agreed process. ServeLocal is operated by [LEGAL ENTITY NAME — Evan].</p>

          <h3>Contact</h3>
          <p>Questions about these Terms: <a href="mailto:[CONTACT EMAIL — Evan]">[CONTACT EMAIL — Evan]</a>. See also our <Link href="/privacy">Privacy Policy</Link>.</p>
        </div>
      </div>
    </V1Shell>
  );
}
