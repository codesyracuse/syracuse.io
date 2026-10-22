export const SITE_NAME = "syracuse.io";
export const SITE_URL = "https://syracuse.io";

/** Meetups have run every month since this (YYYY-MM). */
export const GROUP_SINCE = "2014-04";

export { SLACK_INVITE_URL } from "../config/links.mjs";

/** Mike's own address, only for the "who can I reach out to" intro on home. */
export const MIKE_EMAIL = "mike@syracuse.io";

/** The general contact address: footer, sponsors, jobs, ideas. */
export const CONTACT_EMAIL = "hi@syracuse.io";

/** Buttondown's embed endpoint for the monthly email list. */
export const EMAIL_FORM_ACTION =
  "https://buttondown.com/api/emails/embed-subscribe/syracuseio";

/** Prices shown on /sponsor and /jobs. */
export const PRICES = {
  featuredJob: "$99 for 30 days",
  eventSponsor: "$200 a meetup",
  annualPartner: "$1,500 a year",
};

/** Givebutter page for straight donations. */
export const DONATE_URL = "https://givebutter.com/codesyracuse";

/** Community numbers on /codes and /sponsor, rounded down so they stay true. */
export const COMMUNITY_STATS = {
  asOf: "Oct 2026",
  meetupMembers: "1,500+",
  meetupRating: "4.8★",
  slackMembers: "750+",
};

export const MEETUP_MEMBERS_URL =
  "https://www.meetup.com/syracuse-software-development-meetup/members/";

export const TIME_ZONE = "America/New_York";

/** "/open-hack.html" or "/open-hack/" -> "/open-hack"; "/index.html" -> "/". */
export function cleanPath(pathname: string): string {
  return pathname.replace(/(\/index)?\.html$/, "").replace(/\/+$/, "") || "/";
}
