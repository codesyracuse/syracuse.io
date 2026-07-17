import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  // The site is light-only; "class" (never added) keeps stray dark: variants inert.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        salt: "var(--salt)",
        ink: "var(--ink)",
        brick: "var(--brick)",
        steel: "var(--steel)",
        plow: "var(--plow)",
        card: "var(--card)",
        line: "var(--line)",
        mist: "var(--mist)",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--ink)",
            "--tw-prose-headings": "var(--ink)",
            "--tw-prose-links": "var(--brick)",
            "--tw-prose-links-hover": "var(--ink)",
          },
        },
      }),
      fontFamily: {
        mono: ["ui-monospace", '"SF Mono"', "Menlo", "Consolas", "monospace"],
        sans: [
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [typography],
};
