# CCPA / GDPR / COPPA / State minors'-privacy law — factual background

**Date:** 2026-09-03 (CDT). **Question:** what do CCPA, GDPR, COPPA, and a
sample of state children's-privacy/breach laws actually say and require, as
applied to the *facts* of a US-based, pre-revenue, solo-17-year-old-operated
platform holding personal data (names, DOB, guardian emails, service hours) of
students aged 12–17? **For:** the adult/legal reviewer named in
`docs/LEGAL_REVIEW_PACKET.md` and Evan, ahead of the M11 launch governing-law
decision. **This is NOT a compliance determination and reaches no legal
conclusion** — it exists to hand the reviewer verified facts instead of
unverified statute names, per the gap `legal-triage`'s `cite-scan` found in
`privacy/page.tsx:87` and `LEGAL_REVIEW_PACKET.md:55,58,82` (naming CCPA/GDPR
without showing they apply).

## TL;DR

Of the four regimes named or implied in ServeLocal's privacy policy, **COPPA
is the one actually worth the reviewer's attention, and for a reason nobody
had written down: the site's own stated floor of "under 12 not permitted"
does not exclude COPPA's protected class** — COPPA covers everyone under 13,
so a 12-year-old registrant is still a COPPA "child," and if the signup form
collects an exact date of birth, entering "12" hands the operator
individualized actual knowledge of a covered child at that moment. **CCPA's
three applicability thresholds ($26.625M revenue, 100,000 CA
consumers'/households' records bought/sold/shared, or 50% of revenue from
selling data) are each independently far above ServeLocal's current
documented practice (pre-revenue, no data sale, no third-party sharing)** —
on current facts none of the three appears met, though the statute leaves
"does business in California" itself undefined, an unresolved gap, not a
verified exemption. **GDPR's territorial-scope targeting test (Art. 3(2)(a))
closely matches two of the EDPB's own worked examples of NON-application**
(a US-only service an EU visitor uses without the site targeting them) — but
a separate, non-intent-gated prong (Art. 3(2)(b), behavioral monitoring)
was NOT ruled out by this research and would need the site's actual tracking
practices checked against it (ServeLocal's own M14 design — no third-party
scripts, no cookies — cuts toward non-triggering but wasn't tested against
this specific legal standard). **The Texas SCOPE Act is a genuinely open
question, not a settled non-issue**: it has no revenue/incorporation
threshold at all, and its 3-factor applicability test (social interaction +
public/semi-public profiles + user-generated content visible to others)
plausibly overlaps with ServeLocal's messaging and public-portfolio features
— and it is only *partially* enjoined as of a July 2026 appellate ruling this
research could not fully pin down provision-by-provision (that ruling's scope
is sourced only to a press release from CCIA, the trade association that
challenged the law and has a direct stake in it being struck down — see
Verification table).

## Method

Four sub-topics (CCPA, GDPR, COPPA, state law) researched in parallel by
separate agents per source-type (statute/regulation primary text, official
regulator guidance, one live appellate opinion), then compiled and
cross-analyzed here. **Limitation:** this is desk research against public law
and guidance texts; it cannot and does not assess ServeLocal's actual
registration-UI mechanics, analytics/tracking implementation, or traffic
composition against the legal standards found — those are separate,
answerable facts about the codebase/product that a human (or a follow-up
technical check) would need to supply before any of the open questions below
could be closed.

**Phase effects (2026-09-03):**
```
8.5 verify   — downgraded 2 claims from VERIFIED-VERBATIM to CLOSE-PARAPHRASE
               (CCPA quotes came via a summarizing WebFetch call despite
               matching across two mirrors; the "does business in CA is
               undefined" negative was a single unreplicated search pass).
               Caught one internal inconsistency (COPPA sub-agent's 12-vs-13
               numeric framing) and preserved it because it was correct, not
               an error.
10.5 assess  — real effect, not "no change": a fresh agent given only the
               draft + hypotheses + verification artifacts found (1) a
               same-source dependency the draft had missed (two "CCPA
               doesn't apply" findings both resting on ServeLocal's own
               unverified privacy-page claim), (2) a false "interest
               concentration: none" claim (the TX SCOPE Act injunction-scope
               finding traces to CCIA, an interested litigant, not disclosed
               up front), (3) one Findings sentence stated more confidently
               than its own Verification-table entry supported, and (4) a
               foreseeable gap in the state-law survey (five more states
               with their own minor-privacy provisions, never checked).
               All four were corrected in this revision; (4) triggered the
               one permitted follow-up collection round, which surfaced a
               fifth: Utah's status could not be verified at all against
               primary text, the weakest sourcing tier in the whole brief.
               Verdict: this stage earned its cost on this brief.
```

## Stage 3 — hypotheses (stated before compiling findings against them)

- **H1 (working):** CCPA does not currently apply (sub-threshold on all three
  prongs), but COPPA is the actually relevant regime because of under-13
  exposure risk the stated 12+ floor does not remove.
- **H2 (rival):** CCPA could apply independent of revenue via the data-volume
  or revenue-percentage prongs, regardless of the platform being pre-revenue.
- **H0 (null):** none of the four regimes surveyed currently apply to
  ServeLocal in any respect.

**Verdict against evidence:**
- **H1 survives, partially.** The COPPA under-13/under-12 gap is confirmed
  (§ Findings, COPPA). But "COPPA is relevant" only means a live trigger
  *pathway* exists (actual knowledge from a DOB field, or the site being
  "directed to children"), not that COPPA is shown to apply — that
  determination needs the actual registration-UI and site-presentation facts,
  which this research did not have.
- **H2 dies on current facts, not permanently.** All three CCPA thresholds are
  disjunctive (any one triggers "business" status), but ServeLocal's own
  documented practice — no data sale, no third-party sharing, pre-revenue —
  sits below all three on the numbers alone. This would need re-testing if
  revenue, user count, or data-sharing practice changes.
- **H0 is wounded, not killed** — a real difference, stated precisely because
  the cold assessment (below) pressed on exactly this point. The Texas SCOPE
  Act's 3-factor test was never checked against ServeLocal's actual features
  (messaging, public portfolios): that disconfirming test was never *run*, so
  H0 was never given a genuine chance to die on this point. It is not
  "tested and survived" — it is "untested, and therefore not assertable as
  false." Killing H0 outright would be the "confident wrong brief" this
  method exists to avoid; leaving it silently unresolved would be the mirror
  failure.

## Findings

### CCPA / CPRA (Cal. Civ. Code §1798.100 et seq.)

- **"Business" threshold (§1798.140(d)(1)):** for-profit entity that does
  business in California AND meets ≥1 of: (A) >$26,625,000 annual gross
  revenue (CPI-adjusted from the original $25M, current per CPPA's own
  published adjustment), (B) buys/sells/shares 100,000+ CA consumers'/
  households' personal information annually, or (C) derives ≥50% of annual
  revenue from selling/sharing personal information.
- **No entity-form or headcount exclusion.** A sole proprietorship is not
  excluded by form; the statute names "sole proprietorship... or other legal
  entity" and neither the statute nor the CPPA's own FAQ (verified: "There is
  no mention of employee count requirements in the thresholds") lists a
  headcount floor. Nonprofits/government are excluded, implying for-profit
  status (not size) is the relevant gate.
- **Possible statutory gap, provisional: "does business in the State of
  California" was not found defined** anywhere in Title 1.81.5, on a single
  full-text search pass not independently re-run a second way (see
  Verification table — this is weaker than it reads on first pass). This is
  not a loophole found in ServeLocal's favor — it's an unresolved term whose
  meaning would come from outside the statute (case law, FTB doing-business
  standards), which this research did not chase down (out of scope; flagged,
  not resolved, and not yet confirmed absent).
- **Minors' opt-in (§1798.120(c)):** under-13 requires parent/guardian
  affirmative authorization to sell/share; 13–15 the minor may self-authorize;
  16+ ordinary opt-out. This provision textually applies to "a business" —
  the sub-agent's own structural reading (not a quoted regulator holding) is
  that it therefore inherits the general §1798.140 threshold gate rather than
  triggering independently. **Flagged as an inference, not a confirmed
  interpretation** — no CPPA/AG guidance stating this explicitly was found.
- **Cross-reference to ServeLocal's own documented practice:** the privacy
  page states "we never sell your data" and no third-party analytics/ad
  trackers (M14: first-party counters only). If accurate, this independently
  means the §1798.120(c) opt-in provisions have no sale/share event to attach
  to regardless of threshold status — a factual match worth the reviewer
  seeing, not a conclusion that the statute doesn't apply in some other
  respect (right-to-know/delete/correct do not depend on selling data, only
  on meeting the general threshold).

### GDPR (Regulation (EU) 2016/679)

- **Art. 3(1) establishment test:** not implicated — no EU establishment.
- **Art. 3(2)(a) targeting test:** requires *intent* to offer goods/services
  to EU data subjects — Recital 23 (quoted verbatim from the EDPB's own PDF):
  "the mere accessibility of the controller's... website in the Union... is
  insufficient." The EDPB's own worked Example 10 (a US news app, US-only
  currency/terms, an EU-based US tourist using it) was found to fall
  **outside** GDPR scope on facts closely matching a US-only ServeLocal being
  used by an EU visitor with no EU-targeting features (no EU currency/
  language toggle, no EU marketing).
- **Art. 3(2)(b) monitoring test — separate and NOT intent-gated.** The EDPB
  guidelines explicitly decline to require the same "intent to target" for
  behavioral monitoring: any tracking/profiling of EU-based users' behavior
  could independently trigger this prong regardless of targeting intent.
  ServeLocal's own M14 design (no third-party scripts, no cookies, no stored
  IPs) cuts toward non-triggering, but this research did not test that design
  against this specific legal standard — a genuine unclosed loop, not a
  finding of compliance.
- **Art. 8 (child's consent, 13–16 depending on member state)** is only
  relevant at all if Art. 3 scope is triggered — not reached on current
  facts per the analysis above.

### COPPA (15 U.S.C. §6501 et seq.; 16 C.F.R. Part 312)

- **Trigger:** a site "directed to children under 13," OR any operator with
  "actual knowledge" it is collecting personal information from a child under
  13 (verbatim, both prongs, from the statute and the regulation).
- **The decision-relevant number:** COPPA's "child" = under the age of 13
  (ages 0–12 inclusive). ServeLocal's stated floor — "students under 12 not
  permitted," 12–17 may register — **admits 12-year-olds, who are COPPA
  "children."** The floor does not sit above COPPA's line; it sits one year
  inside it. This is a plain set-membership fact, verified against the
  statute's own age definition, independent of whether COPPA's triggers are
  actually met.
- **Mechanical consequence:** if the signup form collects an exact date of
  birth to enforce the 12+ floor, a registrant entering an age of 12 gives
  the operator **individualized actual knowledge** of a COPPA child at that
  moment (per FTC FAQ A.12/H.1, verified verbatim from ftc.gov) — a
  fact-specific trigger distinct from whether the site as a whole is
  "directed to children."
- **"Directed to children" is a fact question this research cannot answer**:
  it turns on subject matter, visual content, age of models, marketing, and
  audience-composition evidence (16 C.F.R. §312.2, verified verbatim) — about
  ServeLocal's actual presentation, not something a legal-text search
  resolves. ServeLocal serves both students and organizations (a two-sided
  market), which is a fact in the reviewer's favor for arguing "not primarily
  child-directed," but is not itself dispositive and was not evaluated here.
- **A genuinely restrictive rule if the site (or "mixed audience" subset of
  it) is found child-directed:** such a site "may not block children from
  participating altogether" (FTC FAQ D.4/D.6) — outright blocking under-13
  registration is a practice permitted only for a genuinely *general-
  audience* site. Whether ServeLocal's under-12 block is even the right shape
  under COPPA (versus just a stricter business policy) depends on this
  unresolved categorization.
- **Consequences if triggered:** notice + verifiable parental consent (one of
  several enumerated mechanisms — signed form, government-ID check,
  knowledge-based authentication, etc.), parental access/deletion rights,
  retention-limitation duty, and civil penalties up to $53,088/violation
  (FTC's own current figure).

### State law survey (Texas SCOPE Act, California AADC, breach-notification sample)

- **Texas SCOPE Act (Tex. Bus. & Com. Code ch. 509):** applies to a "digital
  service" with ALL THREE of: social interaction between users, public/
  semi-public profiles, and user-generated content viewable by others.
  **No revenue or incorporation/residency threshold at all** — coverage turns
  purely on service features and provider conduct. Ten categorical exemptions
  exist (small business per SBA definition, FERPA/education providers, email/
  DM-only services, among others) — the education-provider exemption is
  worth the reviewer's attention given ServeLocal's subject matter, though
  ServeLocal is not itself an education institution. **Two obligations if
  covered:** may not allow financial transactions, sell/share PII, collect
  precise geolocation, or show targeted ads to a "known minor"; must give a
  verified parent account-control and data-review/deletion tools.
  **Litigation status (verified only to a July 24, 2026 Fifth Circuit
  ruling, sourced to a party press release + secondary coverage, not the
  opinion text itself):** the content-filtering/"duty to prevent harm"
  provision was enjoined on federal-preemption grounds; other provisions
  (age-registration, parental tools, the data-use restrictions above)
  appear NOT to have been part of the confirmed-blocked scope, but this
  research could not verify the provision-by-provision line against the
  actual opinion — **flagged as needing a fresh docket check before anyone
  treats any part of SCOPE Act as settled either way.**
- **California AADC (Civ. Code §§1798.99.28 et seq.):** triggered via the
  CCPA "business" definition (same three thresholds as above) applied to a
  service "likely to be accessed" by under-18 users. **Current status is a
  genuine patchwork, dated to a March 12, 2026 Ninth Circuit ruling** (read
  directly from the court's own opinion text via Justia): the coverage
  definition and age-estimation requirement are currently NOT enjoined (the
  facial challenge failed there); the data-use restrictions and "dark
  patterns" ban remain enjoined as likely unconstitutionally vague; the case
  was remanded. Neither "AADC is in effect" nor "AADC is blocked" is an
  accurate summary as of that date.
- **Breach-notification survey (Texas, Connecticut, Kansas — 3 states, not
  exhaustive):** **no minor-specific carve-out found in any general-purpose
  commercial breach-notification statute checked** (Texas Bus. & Com. Code
  §521.053, Connecticut Gen. Stat. §36a-701b, both verified against their own
  text). The one genuine minor-specific breach clause found (Kansas
  K.S.A. 72-6318, "immediately notify... the parent or legal guardian of the
  student, if a minor") lives in a K-12 student-records statute scoped to
  school districts and their vendors — not a general commercial-platform
  breach law. **Pattern, not a rule:** minor-specific breach duties in US
  state law tend to live in sector-specific education statutes, not general
  consumer breach law, at least among the three states checked.
- **Jurisdiction-trigger comparison (fact only):** Texas SCOPE Act triggers on
  service features/conduct, no residency/incorporation test; California AADC
  triggers on California residents' data (via CCPA), not the operator's own
  location; the breach statutes checked trigger on the *affected person's*
  state of residence. None of the four triggers on where ServeLocal itself
  is based or incorporated — relevant to the still-open "which state"
  decision in `terms/page.tsx:86`, since incorporating in a given state does
  not, on these texts, exempt ServeLocal from another state's law reaching
  its users there.

### Supplementary state-law survey (added after cold assessment flagged the gap)

A cold-assessment pass on this brief's first draft found the state-law survey
skipped a foreseeable set of laws — the other state comprehensive-privacy
statutes carrying their own minor-specific provisions. One bounded follow-up
round covered five more: Connecticut, Colorado, Virginia, Maryland, Utah.
**Headline: these do NOT all work the same way — flattening them into one
bucket would misstate the law.**

- **Connecticut (CTDPA, Gen. Stat. §42-520(a)(7)):** verbatim-confirmed text
  (13–15 age band, consent-based opt-in) is the **pre-2026** version — a 2025
  amendment (PA 25-113) reportedly took effect July 1, 2026, expanding to
  13–17 and replacing consent with a flat prohibition, but the official
  statute page had not been updated as of this check and the amended text
  was NOT independently verified verbatim. **Currently-live wording is
  unconfirmed**, not just the old version — flag this precisely to the
  reviewer rather than citing either version as settled.
- **Colorado (CPA, Rev. Stat. §6-1-1308.5, added by SB 24-041):**
  verbatim-confirmed, in force since October 1, 2025. Consent-based (self-
  consent 13–17, parent/COPPA consent under 13) — structurally similar to
  CT's pre-2026 model, not its post-amendment one.
  No litigation found.
- **Virginia (VCDPA) — structurally different from CT/CO, do not conflate:**
  no 13–17 targeted-ad opt-in exists at all. Instead: §59.1-578(F) is a
  COPPA-deferral rule for "known children" (under 13) only, and §59.1-577.1
  (2025) is a separate social-media-specific law capping a minor's
  (under-16) platform use at one hour/day absent verified parental consent —
  a usage-limit mechanism, not a data-opt-in one. Both verbatim-confirmed.
- **Maryland (Age-Appropriate Design Code, Com. Law §§14-4801–.4806):**
  verbatim-confirmed definitions/applicability; **has its own self-contained
  threshold** (>$25M revenue, or 50,000+ consumers'/households'/devices'
  data, or ≥50% revenue from data sales — independent of any general MD
  privacy-law threshold), keyed to Maryland residents + "does business in
  the State." **Under active litigation** (NetChoice's motion to dismiss was
  denied November 24, 2025; the law remains in effect while that proceeds) —
  the closest state-law analogue to CA AADC's posture, and, unlike AADC, not
  currently enjoined at all.
- **Utah — two statutes, two different postures, neither independently
  verified against primary text:** the Minor Protection in Social Media Act
  has been enjoined since September 10, 2024 pending a Tenth Circuit appeal
  with no ruling found as of this check; the separate App Store
  Accountability Act is nominally in force but the state disclaimed its own
  enforcement authority in an April 2026 court filing, leaving only a
  private right of action that isn't effective until December 31, 2026.
  Utah is the clearest example in this whole brief of "in force" being the
  wrong question — the honest answer is a specific, dated procedural status,
  not a yes/no.
- **Jurisdiction-trigger pattern holds:** all five trigger on the *residents'*
  state, not the operator's location — consistent with the Texas/California/
  breach-law pattern already found. Maryland is the only one of the five
  with its own independent revenue/volume threshold; the other four ride
  their state's general comprehensive-privacy-law threshold.

## Verification table (stage 8.5)

| Load-bearing claim | Source | Verdict |
|---|---|---|
| CCPA business thresholds ($26.625M / 100k / 50%), § 1798.140(d)(1) | leginfo.legislature.ca.gov, cross-checked california.public.law | **CLOSE-PARAPHRASE** — fetched via a summarizing WebFetch call, not a raw text read, despite matching across two mirrors. Corrected down from the sub-agent's own "verbatim" label per this skill's standard. |
| CCPA minors' opt-in structure, § 1798.120(c) | same | CLOSE-PARAPHRASE, same caveat |
| "Does business in CA" undefined in statute | leginfo full-text search, no hit | Negative finding — single search pass, not independently re-run a second way; **provisional**, not confirmed absent |
| GDPR Art. 3(1)/3(2) text | EDPB Guidelines 3/2018 PDF, extracted via `pdftotext` | **VERIFIED-VERBATIM** — genuine document-text extraction, not a summarizer |
| GDPR Art. 8 text | gdpr-info.eu mirror only (eur-lex blocked by WAF) | CLOSE-PARAPHRASE — single-sourced, cross-confirmed only against EDPB's own paraphrase, not a second independent verbatim source |
| COPPA trigger text (15 U.S.C. §6502; 16 C.F.R. §312.3) | Cornell LII + eCFR, live browser `get_page_text` | **VERIFIED-VERBATIM** |
| COPPA "child" = under 13 (§312.2, §6501(1)) | same | **VERIFIED-VERBATIM** |
| FTC FAQ neutral-age-gate / actual-knowledge guidance | ftc.gov, live browser fetch | **VERIFIED-VERBATIM** |
| COPPA penalty figure $53,088 | FTC FAQ, same fetch | VERIFIED-VERBATIM as FTC's own stated figure; **not independently checked against the Federal Register inflation-adjustment notice itself** |
| TX SCOPE Act definitions/obligations, ch. 509 | capitol.texas.gov enrolled bill text, described as browser-fetched | VERIFIED-VERBATIM (taken at the sub-agent's stated method; not independently re-verified in this compilation pass) |
| TX SCOPE Act injunction scope (July 2026) | party press release + secondary coverage, NOT the opinion itself | **UNVERIFIED / NOT-FOUND-equivalent** — explicitly flagged by the sub-agent as needing a docket check |
| CA AADC injunction status (Mar. 12, 2026) | Ninth Circuit opinion via Justia, live browser fetch of the court's own "Court Description" text | **VERIFIED-VERBATIM** |
| CA AADC substantive requirements (DPIAs, default settings, dark patterns) | secondary summaries (FindLaw/CalMatters-style) | **CLOSE-PARAPHRASE at best** — raw Civil Code text not independently fetched |
| CT/KS breach statute text and minor-clause presence/absence | Justia, live browser fetch | VERIFIED-VERBATIM |
| CTDPA minors' clause, §42-520(a)(7) (13–15, consent-based) | cga.ct.gov, live browser fetch | VERIFIED-VERBATIM, but **for a version reportedly superseded July 1, 2026** — the current 13–17/no-consent text is UNVERIFIED |
| CPA minors' clause, §6-1-1308.5 | Justia codified CRS, cross-cited session law | VERIFIED-VERBATIM |
| VCDPA §§59.1-577.1, 59.1-578(F) | law.lis.virginia.gov, live browser fetch, full chapter | VERIFIED-VERBATIM |
| MD AADC §§14-4801–.4802 (definitions/threshold) | Justia codified Maryland Code | VERIFIED-VERBATIM |
| MD AADC §14-4806 (design duties) | secondary sources only | CLOSE-PARAPHRASE, not independently fetched |
| MD AADC litigation status (MTD denied Nov. 24, 2025) | secondary litigation-tracking sources | CLOSE-PARAPHRASE — not a direct court-docket read |
| UT MPSMA / ASAA status and text | secondary litigation-tracking sources (courthousenews, mlex, privacy-daily, deseret) | CLOSE-PARAPHRASE throughout — **no primary Utah Code text fetched for either statute** |

**Structural checks (revised after cold assessment — see below):**

- **Same-source dependency found and not previously disclosed:** the CCPA
  Findings section presents two things as separate support — "H2 dies... no
  data sale, no third-party sharing" and the §1798.120(c) opt-in
  cross-reference ("we never sell your data... **if accurate**...") — that
  actually rest on one input: ServeLocal's own self-reported privacy-page
  claim, never independently verified by this research. It is one data point
  doing two jobs, not two.
- **Interest concentration is NOT "none," corrected from the first draft of
  this brief:** the TX SCOPE Act injunction-scope claim (Findings and
  Verification table) traces to a CCIA press release — CCIA is the trade
  association that sued to block the law, an interested party in the outcome
  it is reporting. The across-the-board load-bearing sources are otherwise
  government/regulator (CPPA, FTC, state legislatures, a court's own
  opinion), and the one vendor source encountered (piwik.pro) was excluded
  from load-bearing findings — but the CCIA case means "none" was wrong, and
  the corrected version belongs in the TL;DR, not buried here (see the SCOPE
  Act sentence in TL;DR, now updated).

## Numbers register

| Number | Claims | Source | Date | Class | Verdict |
|---|---|---|---|---|---|
| $26,625,000 | CCPA revenue threshold (current, CPI-adjusted) | CPPA cpi_adjustment page | accessed 2026-09-03 | INDEPENDENT (regulator) | CLOSE-PARAPHRASE (WebFetch) |
| 100,000 | CCPA consumer/household data-volume threshold | Cal. Civ. Code §1798.140(d)(1)(B) | accessed 2026-09-03 | INDEPENDENT | CLOSE-PARAPHRASE |
| 50% | CCPA revenue-from-selling-data threshold | §1798.140(d)(1)(C) | accessed 2026-09-03 | INDEPENDENT | CLOSE-PARAPHRASE |
| 13 | COPPA "child" age ceiling (under 13) | 15 U.S.C. §6501(1); 16 C.F.R. §312.2 | accessed 2026-09-03 | INDEPENDENT | VERIFIED-VERBATIM |
| 12 | ServeLocal's own stated registration floor | `privacy/page.tsx:85` (this project's own file, not external research) | n/a | INDEPENDENT (primary, own codebase) | VERIFIED-VERBATIM (read directly this session) |
| $53,088 | COPPA max civil penalty per violation | FTC COPPA FAQ, B.2 | accessed 2026-09-03 | INDEPENDENT (regulator) | VERIFIED-VERBATIM |
| $10,000 | TX SCOPE Act max penalty per violation | Texas AG official page | accessed 2026-09-03 | INDEPENDENT | CLOSE-PARAPHRASE (method unconfirmed in compilation pass) |
| 16 (or 13 by member state) | GDPR Art. 8 child-consent age floor | gdpr-info.eu mirror | accessed 2026-09-03 | INDEPENDENT | CLOSE-PARAPHRASE, single-sourced |

## Thin / missing

- **FERPA was never researched**, despite the Texas SCOPE Act's own exemption
  list naming FERPA/education-code providers — a plausible adjacent regime
  for a student-services platform that this brief's scope (CCPA/GDPR/COPPA/
  state-minors-law) did not include. Worth a follow-up pass if the reviewer
  wants full "everything remotely connected" coverage.
- **No survey of data-broker registration laws** (Vermont, California,
  Oregon, Texas each have one) or COPPA Safe Harbor self-regulatory programs
  — both plausibly "remotely connected" and neither was in scope here.
- **Only 8 states total checked for any provision** (TX, CA, CT, CO, VA, MD,
  UT for minors'-privacy law; TX, CT, KS for breach law) — a fuller 50-state
  pass was never attempted and would be a real research project, not an
  extension of this one. The 7 comprehensive-privacy states checked are not
  a random sample — they were picked because they're the states currently
  known for minor-specific amendments; a state with a quieter law could still
  carry an obligation this brief never surfaced.
- **Neither Utah statute's primary text was fetched** — the entire Utah
  entry rests on litigation-tracking secondary sources, the weakest
  sourcing tier in this brief, on a subject (rapid legislative churn +
  active litigation) where that matters most.
- **The current, amended CTDPA minors' text (post-July 2026) was not
  verified** — the only verbatim text obtained is for a version a credible
  secondary source says was superseded before this brief was even written.
- **The TX SCOPE Act's post-injunction provision-by-provision status** is the
  single biggest unresolved factual gap in this brief — it rests on a party
  press release, not the opinion. A CourtListener/PACER pull of the actual
  Fifth Circuit opinion is the next concrete step if this matters for the
  launch timeline.
- **Raw eur-lex.europa.eu access failed** (WAF-blocked automated access,
  not bypassed per policy) — all GDPR article text rests on the EDPB's own
  PDF (for Art. 3, genuinely verbatim) or a third-party mirror (for Art. 8,
  not independently cross-verified against a second source).
- **Nothing here checks ServeLocal's actual registration-form mechanics**
  (exact-DOB entry vs. dropdown, whether it's a "neutral" age gate under the
  FTC's own D.7/H.3 standard) or its live third-party-script footprint against
  GDPR's monitoring prong — both are code facts, answerable by reading
  `frontend/app/register` and the analytics implementation, not by more legal
  research. This is the most concrete next step this brief can name.

## What would change this conclusion

- A CourtListener/PACER read of the actual Fifth Circuit SCOPE Act opinion
  could confirm or contradict the "filtering duty only" reading of what's
  enjoined.
- A registration-UI audit (does the DOB field allow exact entry, is it a
  neutral gate) would resolve whether COPPA's actual-knowledge trigger is
  live today, not just theoretically possible.
- If ServeLocal's revenue, CA-resident user count, or data-sharing practice
  changes, the CCPA threshold analysis above would need to be re-run — it is
  a snapshot of current documented practice, not a permanent exemption.
- A primary eur-lex read of GDPR Art. 8 (currently WAF-blocked) could surface
  wording the mirror omits.

## Sources

CPPA (cppa.ca.gov: FAQ, CPI-adjustment page); California Legislative
Information (leginfo.legislature.ca.gov, Civ. Code §§1798.100, .105, .106,
.120, .121, .140); california.public.law mirror; EDPB Guidelines 3/2018 on
the territorial scope of the GDPR (v2.1, 12 Nov 2019), fetched as PDF from
edpb.europa.eu; gdpr-info.eu (GDPR Art. 8 mirror); 15 U.S.C. §§6501–6502 and
16 C.F.R. Part 312 via law.cornell.edu and ecfr.gov; FTC "Complying with
COPPA: Frequently Asked Questions" (ftc.gov); Texas Legislature enrolled bill
text for HB 18 (capitol.texas.gov); Texas Attorney General SCOPE Act guidance
page; ccianet.org press release on the Fifth Circuit's July 24, 2026 ruling
(an interested party — see Verification table); *NetChoice, LLC v. Bonta*,
No. 25-2366 (9th Cir. Mar. 12, 2026), via law.justia.com; Connecticut Gen.
Stat. §36a-701b and Kansas K.S.A. 72-6318, both via law.justia.com. **Added
in the supplementary state-law round:** Conn. Gen. Stat. §42-520 via
cga.ct.gov and the CT AG's own FAQ (portal.ct.gov); Colo. Rev. Stat.
§6-1-1308.5 via Justia's codified CRS; Va. Code §§59.1-575, -577.1, -578(F)
via law.lis.virginia.gov; Md. Code, Com. Law §§14-4801–.4802 via Justia;
secondary litigation-tracking sources (courthousenews.com, mlex.com,
privacy-daily, deseret.com) for Utah's two statutes' status only, not their
text. All accessed 2026-09-03.
