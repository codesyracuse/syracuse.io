// @ts-check
import { defineConfig, sessionDrivers } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import buildGuard from "./src/integrations/build-guard.mjs";
import { SLACK_INVITE_URL } from "./src/config/links.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://syracuse.io",
  integrations: [buildGuard()],
  adapter: cloudflare({ imageService: "compile" }),
  // Every page is prerendered; a daily rebuild keeps events, jobs and sponsors current.
  output: "static",
  // /open-hack, not /open-hack/, to match the links and canonical URLs.
  trailingSlash: "never",
  build: { format: "file" },
  // The site has no sessions; an explicit driver stops the adapter from
  // adding a KV namespace binding to the Worker.
  session: { driver: sessionDrivers.memory() },
  redirects: {
    // The invite link is temporary, so it's a 302; the rest are permanent.
    "/slack": { status: 302, destination: SLACK_INVITE_URL },
    "/email": { status: 301, destination: "/#email" },
    "/support": { status: 301, destination: "/codes" },
    "/sponsor": { status: 301, destination: "/codes" },
    "/about": { status: 301, destination: "/codes" },
    // Pages from earlier versions of the site.
    "/groups": { status: 301, destination: "/" },
    "/community": { status: 301, destination: "/" },
    "/resources": { status: 301, destination: "/" },
    "/start": { status: 301, destination: "/" },
    "/events": { status: 301, destination: "/#upcoming" },
  },
  vite: {
    server: {
      allowedHosts: [".trycloudflare.com"],
    },
  },
});
