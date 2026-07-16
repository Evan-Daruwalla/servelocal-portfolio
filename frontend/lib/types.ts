/**
 * Client-side mirror of the backend response schemas (`backend/app/schemas/*`).
 * When a schema changes there, update the matching interface here, then the call
 * that returns it in `lib/api.ts`. Grouped by domain below — search the banners
 * (`── Domain ──`) to jump to a type.
 */

// ── Auth & user ──
export type Role = "student" | "org" | "admin";

export type ConsentStatus = "not_required" | "pending" | "verified" | "declined" | "revoked";

export interface User {
  id: string;
  email: string;
  role: Role;
  full_name: string | null;
  is_active: boolean;
  email_notifications: boolean;
  portfolio_public: boolean;
  plan: "free" | "pro";
  created_at: string;
  dob: string | null;
  guardian_consent_status: ConsentStatus;
}

export interface ConsentContext {
  student_first_name: string;
  student_last_initial: string;
}

export interface ConsentManageContext extends ConsentContext {
  status: ConsentStatus;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// ── Opportunities & applications ──
export interface Opportunity {
  id: string;
  org_id: string;
  org_name: string;
  title: string;
  category: string;
  location: string;
  lat: number | null;
  lng: number | null;
  start_time: string;
  end_time: string;
  duration_hours: number;
  skills: string[];
  commitment: string;
  spots_available: number;
  spots_remaining: number;
  description: string;
  requires_approval: boolean;
  min_age: number | null;
  format: string;
  recurrence: "one_time" | "weekly" | "monthly";
  series_end: string | null;
  active: boolean;
  featured: boolean;
  created_at: string;
}

export interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected" | "waitlisted";
  subscription_type: "all_dates" | "single_date";
  single_date: string | null;
  excluded_dates: string[];
  created_at: string;
  resolved_at: string | null;
}

export interface ApplicationWithOpportunity extends Application {
  opportunity: Opportunity;
  // Org-facing only (GET /applications/org); null on a student's own list.
  student_name?: string | null;
  student_email?: string | null;
}

// ── Hours & awards ──
export interface Hours {
  id: string;
  opportunity_id: string;
  user_id: string;
  occurrence_date: string | null;
  hours: number;
  status: "pending" | "verified" | "denied" | "appealed";
  source: "auto" | "self" | "checkin";
  note: string | null;
  supervisor_name: string | null;
  deny_note: string | null;
  appeal_note: string | null;
  appealed: boolean;
  created_at: string;
}

export interface HoursWithOpportunity extends Hours {
  opportunity: Opportunity;
  // Org-facing only (org branch of GET /hours); null on a student's own list.
  student_name?: string | null;
  student_email?: string | null;
}

export interface Award {
  id: string;
  name: string;
  hours: number;
  description: string;
}

export interface MyAwards {
  verified_hours: number;
  earned: Award[];
  next: Award | null;
}

// ── Community (public leaderboard, portfolio, reviews) ──
export interface LeaderboardEntry {
  rank: number;
  name: string;
  hours: number;
}

export interface PublicPortfolio {
  name: string;
  verified_hours: number;
  organizations: number;
  hours_by_org: { org_name: string; hours: number }[];
  awards: Award[];
}

export interface Review {
  id: string;
  org_id: string;
  author_name: string;
  rating: number;
  text: string;
  created_at: string;
}

export interface OrgReviews {
  org_id: string;
  average_rating: number | null;
  count: number;
  reviews: Review[];
}

// ── Notifications & messaging ──
export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  opportunity_id: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string | null;
  body: string;
  created_at: string;
}

// ── Templates & create/update inputs ──
export interface OpportunityTemplate {
  id: string;
  name: string;
  data: {
    title: string;
    category: string;
    location: string;
    lat: number | null;
    lng: number | null;
    skills: string[];
    commitment: string;
    spots_available: number;
    description: string;
    requires_approval: boolean;
    min_age: number | null;
    format: string;
    recurrence: "one_time" | "weekly" | "monthly";
  };
  created_at: string;
}

export interface OpportunityCreateInput {
  title: string;
  category: string;
  location: string;
  lat?: number | null;
  lng?: number | null;
  start_time: string;
  end_time: string;
  skills: string[];
  commitment: string;
  spots_available: number;
  description: string;
  requires_approval: boolean;
  min_age?: number | null;
  format: string;
  recurrence: "one_time" | "weekly" | "monthly";
  series_end?: string | null;
}
