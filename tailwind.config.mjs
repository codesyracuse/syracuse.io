import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "media",
  theme: {
    extend: {
      typography: ({ theme }) => ({
        invert: {
          css: {
            "--tw-prose-links": theme("colors.white"),
            "--tw-prose-links-hover": theme("colors.orange.500"),
          },
        },
        DEFAULT: {
          css: {
            "--tw-prose-links": theme("colors.black"),
            "--tw-prose-links-hover": theme("colors.orange.700"),
          },
        },
      }),
      fontFamily: {
        mono: ['"Monaspace Xenon"', "monospace"],
        headers: ['"Monaspace Xenon"', "monospace"],
      },
    },
  },
  plugins: [typography],
};
