# Onest source

`onest.woff2` is Onest 2.001 by The Onest Project Authors, under the SIL OFL 1.1 (`OFL.txt`, no Reserved Font Name).

- Release: https://github.com/simpals/onest/releases/tag/2.001, `onest-2.001.zip`, sha256 `17b59e19c349e603b7d113a596b6d8e08427e97a7b5235668b69e9d8a06a4267`.
- Output: `onest.woff2`, 50812 bytes, sha256 `97009615aee05a253eafef61a0d28caee5c8443565faebf8ee63786436658a08`. The app and website copies are identical.
- Cut with fontTools 4.60.2 from `fonts/variable/Onest[wght].ttf` in that zip:

```sh
fonttools varLib.instancer "Onest[wght].ttf" wght=400:700 -o onest-400-700.ttf
pyftsubset onest-400-700.ttf --unicodes="U+0000-00FF,U+0100-024F,U+0259,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0400-052F,U+1C80-1C88,U+1E00-1EFF,U+2000-206F,U+2074,U+20A0-20CF,U+2113,U+2116,U+2122,U+2190-22FF,U+2713,U+2C60-2C7F,U+2DE0-2DFF,U+A640-A69F,U+A720-A7FF,U+FE2E-FE2F,U+FEFF,U+FFFD" --layout-features='*' --name-IDs='*' --name-languages='*' --flavor=woff2 --output-file=onest.woff2
```

The ranges are Latin, Latin Extended, Cyrillic, general punctuation, currency, arrows and maths operators, plus U+2713. `--name-IDs='*'` keeps the licence description and URL (name IDs 13 and 14) inside the font. Onest has no glyphs for the macOS key symbols (⌘ ⌥ ⇧ ⌃ ⏎ ⌫) or ⚠, so those fall back per glyph to the system font.
