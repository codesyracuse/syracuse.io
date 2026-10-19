// @ts-check
import { defineConfig, sessionDrivers } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import buildGuard from "./src/integrations/build-guard.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://syracuse.io",
  integrations: [buildGuard()],
  // Prerender in Node: build-time code (the iCal parser) needs Node APIs that
  // workerd lacks, and the pages are static by the time they reach the Worker.
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  // Every page is prerendered; a daily rebuild keeps events, jobs and sponsors current.
  output: "static",
  // The site has no sessions; an explicit driver stops the adapter from
  // adding a KV namespace binding to the Worker.
  session: { driver: sessionDrivers.memory() },
  vite: {
    server: {
      allowedHosts: [".trycloudflare.com"],
    },
  },
});
