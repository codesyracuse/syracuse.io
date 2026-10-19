import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const MARKER = "TBD(mike)";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

/**
 * Checks the built HTML before it can be deployed.
 *
 * 1. Every page must be a complete document. A page that throws during
 *    prerender can be written as a tiny error stub while the build still
 *    exits 0, so this fails the build instead.
 * 2. Placeholders for facts only Mike can supply render visibly as
 *    `TBD(mike)`. With STRICT_TBD=1 (set in the production deploy job) any
 *    that survive into the built HTML fail the build; otherwise they're
 *    listed as a warning.
 */
export default function buildGuard() {
  return {
    name: "build-guard",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const hits = [];
        const broken = [];
        for await (const file of walk(root)) {
          const html = await readFile(file, "utf8");
          if (!html.includes("</html>")) broken.push(path.relative(root, file));
          const count = html.split(MARKER).length - 1;
          if (count > 0) hits.push(`${path.relative(root, file)} (${count})`);
        }
        if (broken.length > 0) {
          throw new Error(
            `Incomplete pages (render failed?): ${broken.join(", ")}`
          );
        }
        if (hits.length === 0) return;

        const summary = `${MARKER} placeholders remain in: ${hits.join(", ")}`;
        if (process.env.STRICT_TBD === "1") {
          throw new Error(summary);
        }
        logger.warn(summary);
      },
    },
  };
}
