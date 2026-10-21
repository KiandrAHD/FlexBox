# Bundled fonts

Fonts follow the typography in `DESIGN_SYSTEM.md`: Space Grotesk Medium (500) for display and Inter Regular (400) / SemiBold (600) for body and labels.

## Sources and licensing

Downloaded from the official [Google Fonts repository](https://github.com/google/fonts), pinned to commit `47d54ca1ebb14fd864695f1d39dc734f39017c33`.

| Local file | Official source | Static axes |
| --- | --- | --- |
| `SpaceGrotesk-Medium.ttf` | [SpaceGrotesk[wght].ttf](https://raw.githubusercontent.com/google/fonts/47d54ca1ebb14fd864695f1d39dc734f39017c33/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf) | `wght=500` |
| `Inter-Regular.ttf` | [Inter[opsz,wght].ttf](https://raw.githubusercontent.com/google/fonts/47d54ca1ebb14fd864695f1d39dc734f39017c33/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf) | `opsz=14, wght=400` |
| `Inter-SemiBold.ttf` | [Inter[opsz,wght].ttf](https://raw.githubusercontent.com/google/fonts/47d54ca1ebb14fd864695f1d39dc734f39017c33/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf) | `opsz=14, wght=600` |

Google Fonts distributes these families as variable TrueType files. These bundled files are full, unsubsetted static instances generated using fontTools 4.61.1 `instantiateVariableFont(..., inplace=False, updateFontNames=True)` at the axes above. Inter uses its default optical size of 14. No outlines were substituted.

Both families are licensed under the SIL Open Font License 1.1. Original license texts were downloaded unchanged:

- `SpaceGrotesk-OFL.txt`: [official source](https://raw.githubusercontent.com/google/fonts/47d54ca1ebb14fd864695f1d39dc734f39017c33/ofl/spacegrotesk/OFL.txt)
- `Inter-OFL.txt`: [official source](https://raw.githubusercontent.com/google/fonts/47d54ca1ebb14fd864695f1d39dc734f39017c33/ofl/inter/OFL.txt)

Keep the corresponding license with redistributed fonts.

## Validation

Each output was reopened with fontTools checksum checking enabled. Verified TrueType signature, glyph outlines, requested `OS/2.usWeightClass`, and absence of variable axes (`fvar`).

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `SpaceGrotesk-Medium.ttf` | 88328 | `df41e224d2712b282eea65d15373d838c78beced8e5cc7087e927cac89db0253` |
| `Inter-Regular.ttf` | 341396 | `498ffb092a71f5d8025a4fc657bc7afa58bcd868a17b70925987c6fc81c83372` |
| `Inter-SemiBold.ttf` | 342688 | `88c273bdb7a4fb765056bbbb463fe7b67507bb515c670dfb2850926ef1723dc3` |
