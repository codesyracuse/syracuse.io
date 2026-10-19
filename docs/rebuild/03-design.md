# Design

**Direction:** sharp and plain. Keep the color and type from the `site-redesign-2026` branch (`src/styles/global.css`, `docs/REDESIGN.md`) and drop its developer motifs. Reference mockups: `reference/index.html` and `reference/open-hack.html` (open them in a browser; inline styles hold the exact values).

**Organizing idea:** the schedule is the brand. The next date is the largest thing on the home and series pages.

## Keep from the redesign branch

Tokens, unchanged:

```css
:root {
  --salt:  #F1F2EE;  /* page background (cool, never warm cream) */
  --ink:   #1B211F;  /* text; header, hero and footer background; card borders */
  --brick: #A03C2A;  /* primary CTA, links that act */
  --steel: #33566B;  /* "three ways in" band, card backshadow, secondary labels */
  --plow:  #EDB230;  /* scarce accent: ".io" in the wordmark, the day name in the hero date. Nowhere else. */
  --card:  #FBFBF9;  /* card backgrounds */
  --line:  #D4D6D0;  /* hairline row separators */
  --muted: #5A625D;  /* secondary text on salt */
  --muted-on-ink: #C9CDC8;
}
```

Type:
- No webfonts. Prose and headlines: `system-ui` stack, weight 800 for headlines, tight negative letter-spacing on big sizes.
- **Data is monospace** (`ui-monospace, "SF Mono", Menlo, Consolas`): dates, times, venues, nav, buttons, eyebrows, captions, footer.
- Section headings: UPPERCASE, 800, letter-spacing 0.02em, sitting on a 2px ink rule.
- Eyebrows: mono, 12px, uppercase, letter-spacing 0.14em.

Components:
- **Card:** `--card` background, 2px ink border, 4px radius. Cards that are links get `box-shadow: 4px 4px 0 var(--steel)`; static cards don't.
- **Buttons:** mono, 3px radius. Primary = brick on salt or ink. Ghost = 1px border in a muted tone. Min height 44px.
- **Event row:** mono date (`TUE 11·10`), series name in sans 700, mono venue/time in muted, brick "RSVP →". Hairline between rows; the whole row is the link.
- **Dark header + hero** (`--ink` band); body on `--salt`; one `--steel` band for "Three ways in"; dark footer.

## Drop from the redesign branch

- Prompt line in the hero, box-drawing pane titles (`┤ SECTION ├`), tmux statusbar, snowball counter
- Stats strip
- The "If it could appear in a terminal, it's mono" framing in copy. Mono is used for data, not as a costume.

## Layout

- Max content width ~1040px, 24px gutter.
- Mobile first: the hero (series, date, venue, RSVP) fits above the fold at 375×667. Flex rows wrap; event-row meta wraps under the title on small screens.
- No carousels, animated counters, or scroll effects. Respect `prefers-reduced-motion`.

## Photography

- Real event photos only; 3:2 crop; mono caption (`Open Hack · 09·08`).
- Section hidden until there are photos.

## Avoid

Stock photos, gradients, emoji in UI, stat counters, any second accent color beyond the palette above.
