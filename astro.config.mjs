// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  adapter: cloudflare(),
  output: "server",
  redirects: {
    "/community": { status: 301, destination: "/start" },
    "/slack": { status: 301, destination: "/start" },
    "/resources": { status: 301, destination: "/start" },
    "/groups": { status: 301, destination: "/events" },
  },
});
