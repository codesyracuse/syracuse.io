export const SITE_NAME = "syracuse.io";
export const SITE_URL = "https://syracuse.io";

/** Meetups have run every month since this (YYYY-MM). */
export const GROUP_SINCE = "2014-04";

/**
 * Where /slack redirects. Carried over from the old site; confirm it doesn't
 * expire (shared invites often do) before launch.
 */
export const SLACK_INVITE_URL =
  "https://join.slack.com/t/syracuseio/shared_invite/zt-aw7rkg3q-2cgCecN524oOVarFJWMOPw";

/** Mike's address, as written in the approved home page copy. */
export const MIKE_EMAIL = "mike@syracuse.io";

/** Canonical general contact address for the footer. */
export const CONTACT_EMAIL = "TBD(mike)";

/** Email list provider's form endpoint. Provider is undecided. */
export const EMAIL_FORM_ACTION = "TBD(mike)";

export const TIME_ZONE = "America/New_York";

/** "/open-hack.html" or "/open-hack/" -> "/open-hack"; "/index.html" -> "/". */
export function cleanPath(pathname: string): string {
  return pathname.replace(/(\/index)?\.html$/, "").replace(/\/+$/, "") || "/";
}
