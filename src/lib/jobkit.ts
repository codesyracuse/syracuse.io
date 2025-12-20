export interface JobKitTerm {
  id: number;
  name: string;
}

export interface JobKitCategory {
  id: number;
  name: string;
}

export interface JobKitPlan {
  id: number;
  name: string;
  price: number;
  period: number;
  highlight: boolean;
  badge: boolean;
  pin: boolean;
}

export interface JobKitJob {
  id: number;
  title: string;
  description: string;
  location: string;
  arrangement: "remote" | "onsite" | "hybrid";
  salary: string | null;
  salary_currency: string;
  salary_period: "yearly" | "monthly" | "hourly";
  company: string;
  company_website: string | null;
  application_type: "email" | "link";
  application_email: string | null;
  term: JobKitTerm;
  category: JobKitCategory;
  plan: JobKitPlan;
  logo: string | null;
  url: string;
  preview_image_url: string;
  created_at: string;
}

const JOBKIT_API = "https://jobs.syracuse.io/jobs.json";

export async function fetchJobs(): Promise<JobKitJob[]> {
  try {
    const response = await fetch(JOBKIT_API, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`JobKit API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching jobs from JobKit:", error);
    throw error;
  }
}

export async function fetchJobById(id: number): Promise<JobKitJob | null> {
  const jobs = await fetchJobs();
  return jobs.find((job) => job.id === id) || null;
}

export function generateSlug(job: JobKitJob): string {
  const titleSlug = job.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${job.id}-${titleSlug}`;
}

export function parseIdFromSlug(slug: string): number | null {
  const match = slug.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : null;
}

export function sortJobs(jobs: JobKitJob[]): JobKitJob[] {
  // Featured (pinned/highlighted) first, then by date
  return [...jobs].sort((a, b) => {
    const aFeatured = a.plan.pin || a.plan.highlight;
    const bFeatured = b.plan.pin || b.plan.highlight;
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });
}

export function formatSalary(job: JobKitJob): string | null {
  if (!job.salary) return null;

  const amount = parseFloat(job.salary);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: job.salary_currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const periodMap: Record<string, string> = {
    yearly: "year",
    monthly: "month",
    hourly: "hour",
  };

  return `${formatted}/${periodMap[job.salary_period] || job.salary_period}`;
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
