export const SITE_NAME = "syracuse.io";
export const SITE_URL = "https://syracuse.io";

/** Meetups have run every month since this (YYYY-MM). */
export const GROUP_SINCE = "2014-04";

export { SLACK_INVITE_URL } from "../config/links.mjs";

/** Mike's address, as written in the approved home page copy. */
export const MIKE_EMAIL = "mike@syracuse.io";

/** Canonical general contact address for the footer. */
export const CONTACT_EMAIL = "hi@syracuse.io";

/** Buttondown's embed endpoint for the monthly email list. */
export const EMAIL_FORM_ACTION =
  "https://buttondown.com/api/emails/embed-subscribe/syracuseio";

/** Prices shown on /codes and /jobs. */
export const PRICES = {
  featuredJob: "$99 for 30 days",
  eventSponsor: "$200 a meetup",
  annualPartner: "$1,500 a year",
};

export const TIME_ZONE = "America/New_York";

/** "/open-hack.html" or "/open-hack/" -> "/open-hack"; "/index.html" -> "/". */
export function cleanPath(pathname: string): string {
  return pathname.replace(/(\/index)?\.html$/, "").replace(/\/+$/, "") || "/";
}
