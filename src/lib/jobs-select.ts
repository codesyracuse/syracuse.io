import { calendarDay, localDateKey } from "./events/format";

interface JobLike {
  data: { expires: Date; featured: boolean; posted: Date };
}

/**
 * Unexpired jobs, featured first, then newest. `expires` is a date-only value
 * and a job stays up through that whole calendar day in Syracuse.
 */
export function selectActiveJobs<T extends JobLike>(
  jobs: T[],
  now = new Date()
): T[] {
  const today = localDateKey(now);
  return jobs
    .filter(({ data }) => calendarDay(data.expires) >= today)
    .sort(
      (a, b) =>
        Number(b.data.featured) - Number(a.data.featured) ||
        b.data.posted.getTime() - a.data.posted.getTime()
    );
}
