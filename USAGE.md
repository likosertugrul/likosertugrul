# Profile banner — usage

| file | what it is |
| --- | --- |
| `dark.svg` | banner, GitHub dark theme |
| `light.svg` | banner, GitHub light theme |
| `btn-github.svg` `btn-linkedin.svg` `btn-x.svg` `btn-site.svg` | small link buttons, one per destination (work on both themes) |
| `build.js` | generator — edit this, then `node build.js` |

## README snippet

Upload the files to `github.com/likosertugrul/likosertugrul`, then at the top of `README.md`:

```md
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/likosertugrul/likosertugrul/main/dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/likosertugrul/likosertugrul/main/light.svg">
  <img alt="Ertuğrul — Frontend Engineer" src="https://raw.githubusercontent.com/likosertugrul/likosertugrul/main/dark.svg" width="100%">
</picture>

<p align="center">
  <a href="https://github.com/likosertugrul"><img src="https://raw.githubusercontent.com/likosertugrul/likosertugrul/main/btn-github.svg" height="44" alt="GitHub"></a>
  <a href="https://www.linkedin.com/in/likosertugrul"><img src="https://raw.githubusercontent.com/likosertugrul/likosertugrul/main/btn-linkedin.svg" height="44" alt="LinkedIn"></a>
  <a href="https://x.com/likosertugrul"><img src="https://raw.githubusercontent.com/likosertugrul/likosertugrul/main/btn-x.svg" height="44" alt="X"></a>
  <a href="https://likosertugrul.com"><img src="https://raw.githubusercontent.com/likosertugrul/likosertugrul/main/btn-site.svg" height="44" alt="Portfolio"></a>
</p>
```

GitHub swaps dark/light automatically. `width="100%"` keeps the banner responsive — it has a
`viewBox`, so it scales without cropping.

## Why the icons inside the banner aren't clickable

In a README, GitHub serves every image through its `camo` proxy as a plain `<img>`. Inside an
`<img>`, an SVG is a static picture: no links, no hover, no JS. That is a GitHub restriction, not
something the SVG can opt out of. Three ways around it, all included here:

1. **Link buttons** (`btn-*.svg`) — separate images, each wrapped in a real markdown link. This is
   the only approach that gives you four *different* click targets inside a README.
2. **One link for the whole banner** — wrap the `<picture>` block in `<a href="…">…</a>` if you just
   want the header itself to be clickable.
3. **Real `<a>` elements inside the banner** — already embedded around the four social icons. They
   are live whenever the SVG is opened directly or inlined into a page (e.g. on likosertugrul.com),
   and inert in the README.

## Editing

Everything lives in `build.js`:

- `PROFILE` — name, handle, roles, info rows, skills, links
- `THEMES` — the two palettes
- `ART` — the ASCII portrait (50 × 25, generated from the source photo)

```sh
node build.js     # rewrites all six SVGs
```

## Notes

- Pure SVG + SMIL, no JavaScript, no external fonts or assets. ~71 KB per banner.
- Hover effects (pill scale + glow, icon lift) are CSS — same story as links: live when inlined,
  inert inside a README.
- If a renderer ignores SMIL entirely, the banner still shows its finished state; the intro
  animations hold the "hidden" value rather than using it as the base value.
