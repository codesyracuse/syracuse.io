/**
 * GA4 plus a Google Ads conversion tag, loaded once the page has finished
 * loading and never when the visitor sends Do Not Track or Global Privacy
 * Control. Conversion events come from clicks on [data-track] links and from
 * the "syracuse:track" event the email form dispatches.
 */

type Params = Record<string, string | undefined>;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: Gtag;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  }
}

const GA_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID as string | undefined;
const ADS_ID = import.meta.env.PUBLIC_ADS_ID as string | undefined;

// { "rsvp_click": "AW-123456789/AbCdEf", ... }, one label per conversion.
let conversions: Record<string, string> = {};
try {
  conversions = JSON.parse(
    (import.meta.env.PUBLIC_ADS_CONVERSIONS as string | undefined) || "{}"
  );
} catch {
  /* a malformed value just means no Ads conversions fire */
}

function optedOut(): boolean {
  const w = window as unknown as { doNotTrack?: string };
  return (
    navigator.doNotTrack === "1" ||
    w.doNotTrack === "1" ||
    navigator.msDoNotTrack === "1" ||
    navigator.globalPrivacyControl === true
  );
}

function track(name: string, params: Params = {}) {
  window.gtag("event", name, { ...params, transport_type: "beacon" });
  const sendTo = conversions[name];
  if (sendTo) window.gtag("event", "conversion", { send_to: sendTo });
}

function eventFor(link: HTMLAnchorElement): [string, Params] | undefined {
  switch (link.dataset.track) {
    case "rsvp":
      return [
        "rsvp_click",
        { series: link.dataset.series, provider: link.dataset.provider },
      ];
    case "slack":
      return ["slack_click"];
    case "sponsor_contact":
      return ["sponsor_contact", { way: link.dataset.way }];
  }
  // Any other link to /slack still counts.
  if (link.origin === location.origin && link.pathname === "/slack") {
    return ["slack_click"];
  }
}

function start() {
  if (optedOut() || (!GA_ID && !ADS_ID)) return;

  window.dataLayer = window.dataLayer || [];
  // gtag.js needs the arguments object itself, not an array.
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  if (GA_ID) window.gtag("config", GA_ID);
  if (ADS_ID) window.gtag("config", ADS_ID);

  document.addEventListener("click", (e) => {
    const link = (e.target as Element).closest?.("a");
    const found = link && eventFor(link);
    if (found) track(...found);
  });
  document.addEventListener("syracuse:track", (e) => {
    const { name, params } = (e as CustomEvent).detail;
    track(name, params);
  });

  // Load the library after the page is interactive and the browser is idle.
  const load = () => {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID || ADS_ID}`;
    document.head.appendChild(s);
  };
  const idle = () =>
    "requestIdleCallback" in window
      ? window.requestIdleCallback(load, { timeout: 4000 })
      : setTimeout(load, 2000);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

start();
