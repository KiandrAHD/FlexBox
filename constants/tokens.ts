/**
 * Design tokens derived from DESIGN_SYSTEM.md
 *
 * Status labels:
 * [D] Ditentukan — explicitly required by brief
 * [R] Repository — visible in repo implementation, not verified against Figma
 * [E] Estimasi — recommendation for consistency
 */

// ─── Colors ────────────────────────────────────────────────────────────────────
export const colors = {
  ink: "#050505", // [D] Primary text, dark bg, primary button, strong border
  blue: "#3F83C5", // [D] Brand accent, link/active, focus, logo
  pale: "#D5DFF0", // [D] Background accent, logo, selected surface
  graphite: "#454A54", // [D] Secondary text, dark visual, logo
  white: "#FFFFFF", // [D] Surface & inverse text
  paper: "#F7F7F3", // [R][V] Off-white public canvas
  adminCanvas: "#F2F2EF", // [R][V] Dashboard canvas
  line: "#D8D8D5", // [R][V] Divider default
  muted: "#777777", // [E] Metadata & helper text
  successBg: "#E9F2EA", // [R][V] Success badge bg
  successText: "#37673E", // [R][V] Success badge text
  error: "#B42318", // [E] Error text/border
  warning: "#9A6700", // [E] Warning state
} as const;

// ─── Typography ────────────────────────────────────────────────────────────────
export const fontFamilies = {
  display: "Space Grotesk",
  body: "Inter",
} as const;

// ─── Spacing (base unit: 4px) ──────────────────────────────────────────────────
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  30: 120,
} as const;

// ─── Breakpoints ───────────────────────────────────────────────────────────────
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

// ─── Border & Radius ───────────────────────────────────────────────────────────
export const radius = {
  none: 0,
  xs: 2,
  sm: 4,
} as const;

// ─── Motion ────────────────────────────────────────────────────────────────────
export const motion = {
  fast: 140,
  base: 200,
  slow: 320,
} as const;

// ─── Z-Index ───────────────────────────────────────────────────────────────────
export const zIndex = {
  base: 0,
  sticky: 10,
  header: 20,
  drawer: 40,
  backdrop: 50,
  modal: 60,
  toast: 70,
} as const;

// ─── Shadows (web only) ────────────────────────────────────────────────────────
export const shadows = {
  none: "none",
  overlay: "0 16px 48px rgba(5,5,5,.16)",
} as const;

